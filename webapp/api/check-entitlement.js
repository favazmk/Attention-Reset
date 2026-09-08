import { getAdminDb, verifyRequest } from './_firebase-admin.js';
import { getRazorpay, grantEntitlement } from './_entitlement.js';
import {
  DEFAULT_PRODUCT_ID,
  getProduct,
  readEntitlements,
  toPaise,
} from './_products.js';

/**
 * Safety net for the "paid but never got access" case — the browser closing
 * between Razorpay capturing the money and /api/verify-payment running.
 *
 * The app calls this on sign-in. It looks at the user's outstanding orders and
 * asks Razorpay whether any were actually paid; if so, access is granted here
 * instead. With more than one product on sale it has to keep going after the
 * first recovery: someone can have bought the reset and the add-on in the same
 * session and lost the browser after both.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not signed in.' });
  }

  const db = getAdminDb();

  try {
    const userSnap = await db.collection('users').doc(user.uid).get();
    const owned = readEntitlements(userSnap.exists ? userSnap.data() : {});

    const pending = await db
      .collection('orders')
      .where('uid', '==', user.uid)
      .where('status', '==', 'created')
      .get();

    if (pending.empty) {
      return res.status(200).json({ enrolled: owned.reset7, entitlements: owned });
    }

    const razorpay = getRazorpay();
    const recovered = [];

    for (const docSnap of pending.docs) {
      const productId = docSnap.data().product_id || DEFAULT_PRODUCT_ID;

      // Nothing to recover for something they already hold.
      if (owned[productId]) continue;

      const product = getProduct(productId);
      if (!product) continue;

      let order;
      try {
        order = await razorpay.orders.fetch(docSnap.id);
      } catch (err) {
        console.error(`Could not fetch order ${docSnap.id}:`, err.message);
        continue;
      }

      const expectedPaise =
        Number(order.notes?.expected_paise) ||
        Number(docSnap.data().amount_paise) ||
        toPaise(product.priceRupees);

      if (order.status !== 'paid' || Number(order.amount_paid) < expectedPaise) continue;

      let paymentId = order.id;
      try {
        const payments = await razorpay.orders.fetchPayments(order.id);
        const captured = payments.items?.find((p) => p.status === 'captured');
        if (captured) paymentId = captured.id;
      } catch (err) {
        console.error(`Could not fetch payments for ${order.id}:`, err.message);
      }

      await grantEntitlement({
        uid: user.uid,
        productId,
        orderId: order.id,
        paymentId,
        amountPaise: Number(order.amount_paid),
        expectedPaise,
      });

      owned[productId] = true;
      recovered.push(productId);
    }

    // Tidy up whatever is left unpaid and old enough to be abandoned.
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    await Promise.all(
      pending.docs
        .filter((d) => !recovered.includes(d.data().product_id || DEFAULT_PRODUCT_ID))
        .filter((d) => (d.data().created_at?.toMillis?.() ?? Date.now()) < cutoff)
        .map((d) => d.ref.set({ status: 'abandoned' }, { merge: true }))
    ).catch((err) => console.error('Order cleanup failed:', err.message));

    return res.status(200).json({
      enrolled: owned.reset7,
      entitlements: owned,
      recovered: recovered.length ? recovered : undefined,
    });
  } catch (err) {
    console.error('Entitlement check failed:', err);
    return res.status(500).json({ error: 'Could not check your access right now.' });
  }
}
