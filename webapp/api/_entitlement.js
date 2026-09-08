import Razorpay from 'razorpay';
import { getAdminDb, FieldValue } from './_firebase-admin.js';
import { CURRENCY } from './_products.js';

let razorpay;

export function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

const ALREADY_EXISTS = 6; // gRPC status code Firestore uses for create() collisions

function isDuplicate(err) {
  return err?.code === ALREADY_EXISTS || /ALREADY_EXISTS/i.test(err?.message || '');
}

/**
 * Records a purchase and grants access to one product. Safe to call repeatedly
 * with the same payment — `purchases/{paymentId}` is claimed with create(), so
 * a replayed request is recognised and does nothing the second time.
 *
 * The caller must have already confirmed with Razorpay that this payment is
 * real and belongs to this user. `amountPaise` must come from Razorpay, never
 * from the browser.
 */
export async function grantEntitlement({
  uid,
  productId,
  orderId,
  paymentId,
  amountPaise,
  expectedPaise,
}) {
  const db = getAdminDb();
  const purchaseRef = db.collection('purchases').doc(paymentId);

  let firstTime = true;
  try {
    await purchaseRef.create({
      uid,
      product_id: productId,
      order_id: orderId,
      payment_id: paymentId,
      amount_paise: amountPaise,
      expected_amount_paise: expectedPaise,
      currency: CURRENCY,
      created_at: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    if (!isDuplicate(err)) throw err;
    firstTime = false;
  }

  // Always re-assert entitlement: if the first attempt died between the purchase
  // write and the user write, the retry has to be able to finish the job.
  //
  // The timestamps are the exception, and the reason this runs in a transaction.
  // `enrolled_at` is what the new-buyer price window is measured from, so
  // re-stamping it on every retry would quietly extend that window each time a
  // grant was replayed. They are written once and never moved.
  const userRef = db.collection('users').doc(uid);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const existing = snap.exists ? snap.data() : {};

    // Nested objects, NOT dotted keys.
    //
    // `set()` does not parse dot notation the way `update()` does — it escapes
    // "entitlements.deepwork" and writes a single top-level field with a dot in
    // its literal name. Nothing would ever read that back: every reader looks at
    // `data.entitlements?.[productId]`, so a paying customer would appear
    // unentitled on their next load, and `resolvePurchase` would happily sell
    // them the same product again. `set({merge:true})` with a real nested object
    // merges map keys individually, so other products' entries survive.
    const userUpdate = {
      entitlements: { [productId]: true },
      last_payment_id: paymentId,
    };

    if (!existing.entitled_at?.[productId]) {
      userUpdate.entitled_at = { [productId]: FieldValue.serverTimestamp() };
    }

    // `isEnrolled` predates there being more than one product. It stays the
    // canonical flag for the reset, because the security rules, the client's
    // paywall and every existing customer's document are all written in terms
    // of it. New products only ever live in the `entitlements` map.
    if (productId === 'reset7') {
      userUpdate.isEnrolled = true;
      if (!existing.enrolled_at) {
        userUpdate.enrolled_at = FieldValue.serverTimestamp();
      }
    }

    tx.set(userRef, userUpdate, { merge: true });
  });

  await db
    .collection('orders')
    .doc(orderId)
    .set({ status: 'paid', payment_id: paymentId }, { merge: true })
    .catch((err) => console.error('Order status update failed:', err.message));

  return { firstTime };
}
