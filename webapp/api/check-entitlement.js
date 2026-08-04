import { getAdminDb, verifyRequest } from './_firebase-admin.js';
import { getRazorpay, grantEntitlement } from './_entitlement.js';
import { PRICE_PAISE } from './_pricing.js';

/**
 * Safety net for the "paid but never got access" case — the browser closing
 * between Razorpay capturing the money and /api/verify-payment running.
 *
 * The app calls this on sign-in for anyone who isn't enrolled yet. It looks at
 * that user's outstanding orders and asks Razorpay whether any of them were
 * actually paid; if so, access is granted here instead.
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
    if (userSnap.exists && userSnap.data().isEnrolled) {
      return res.status(200).json({ enrolled: true });
    }

    const pending = await db
      .collection('orders')
      .where('uid', '==', user.uid)
      .where('status', '==', 'created')
      .get();

    if (pending.empty) {
      return res.status(200).json({ enrolled: false });
    }

    const razorpay = getRazorpay();

    for (const docSnap of pending.docs) {
      let order;
      try {
        order = await razorpay.orders.fetch(docSnap.id);
      } catch (err) {
        console.error(`Could not fetch order ${docSnap.id}:`, err.message);
        continue;
      }

      if (order.status !== 'paid' || Number(order.amount_paid) < PRICE_PAISE) continue;

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
        orderId: order.id,
        paymentId,
        amountPaise: Number(order.amount_paid),
      });

      return res.status(200).json({ enrolled: true, recovered: true });
    }

    // Nothing paid — tidy up orders that are old enough to be abandoned.
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    await Promise.all(
      pending.docs
        .filter((d) => (d.data().created_at?.toMillis?.() ?? Date.now()) < cutoff)
        .map((d) => d.ref.set({ status: 'abandoned' }, { merge: true }))
    ).catch((err) => console.error('Order cleanup failed:', err.message));

    return res.status(200).json({ enrolled: false });
  } catch (err) {
    console.error('Entitlement check failed:', err);
    return res.status(500).json({ error: 'Could not check your access right now.' });
  }
}
