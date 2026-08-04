import Razorpay from 'razorpay';
import { getAdminDb, FieldValue } from './_firebase-admin.js';
import { CURRENCY, PRICE_PAISE } from './_pricing.js';

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
 * Records a purchase and grants course access. Safe to call repeatedly with the
 * same payment — `purchases/{paymentId}` is claimed with create(), so a replayed
 * request is recognised and does nothing the second time.
 *
 * The caller must have already confirmed with Razorpay that this payment is real
 * and belongs to this user. `amountPaise` must come from Razorpay, never from the
 * browser.
 */
export async function grantEntitlement({ uid, orderId, paymentId, amountPaise }) {
  const db = getAdminDb();
  const purchaseRef = db.collection('purchases').doc(paymentId);

  let firstTime = true;
  try {
    await purchaseRef.create({
      uid,
      order_id: orderId,
      payment_id: paymentId,
      amount_paise: amountPaise,
      expected_amount_paise: PRICE_PAISE,
      currency: CURRENCY,
      created_at: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    if (!isDuplicate(err)) throw err;
    firstTime = false;
  }

  // Always re-assert entitlement: if the first attempt died between the purchase
  // write and the user write, the retry has to be able to finish the job.
  await db.collection('users').doc(uid).set(
    {
      isEnrolled: true,
      enrolled_at: FieldValue.serverTimestamp(),
      last_payment_id: paymentId,
    },
    { merge: true }
  );

  await db
    .collection('orders')
    .doc(orderId)
    .set({ status: 'paid', payment_id: paymentId }, { merge: true })
    .catch((err) => console.error('Order status update failed:', err.message));

  return { firstTime };
}
