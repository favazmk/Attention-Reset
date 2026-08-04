import { getAdminDb, verifyRequest, FieldValue } from './_firebase-admin.js';
import { getRazorpay } from './_entitlement.js';
import { CURRENCY, PRICE_PAISE } from './_pricing.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'You need to be signed in to start a purchase.' });
  }

  const db = getAdminDb();

  // Already paid? Don't sell it to them twice.
  try {
    const userSnap = await db.collection('users').doc(user.uid).get();
    if (userSnap.exists && userSnap.data().isEnrolled) {
      return res.status(409).json({ error: 'already_enrolled' });
    }
  } catch (err) {
    console.error('Enrolment pre-check failed:', err);
    // Non-fatal — worst case they get shown a payment sheet for something they own.
  }

  try {
    const order = await getRazorpay().orders.create({
      amount: PRICE_PAISE,
      currency: CURRENCY,
      receipt: `ar_${user.uid.slice(0, 20)}_${Date.now()}`,
      notes: { uid: user.uid },
    });

    // Recorded so /api/check-entitlement can reconcile later if the browser dies
    // between Razorpay taking the money and us hearing about it.
    await db
      .collection('orders')
      .doc(order.id)
      .set({
        uid: user.uid,
        amount_paise: PRICE_PAISE,
        currency: CURRENCY,
        status: 'created',
        created_at: FieldValue.serverTimestamp(),
      })
      .catch((err) => console.error('Order record write failed:', err.message));

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }
}
