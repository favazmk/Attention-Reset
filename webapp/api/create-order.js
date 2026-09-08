import { getAdminDb, verifyRequest, FieldValue } from './_firebase-admin.js';
import { getRazorpay } from './_entitlement.js';
import { CURRENCY, DEFAULT_PRODUCT_ID, getProduct, resolvePurchase } from './_products.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'You need to be signed in to start a purchase.' });
  }

  // The browser names which product it wants; it never names a price.
  const productId = String(req.body?.productId || DEFAULT_PRODUCT_ID);
  const product = getProduct(productId);
  if (!product) {
    return res.status(400).json({ error: 'Unknown product.' });
  }

  const db = getAdminDb();

  // What this user may buy, and for how much, is decided here from their own
  // server-side record — not from anything the request carried.
  let purchase;
  try {
    const userSnap = await db.collection('users').doc(user.uid).get();
    purchase = resolvePurchase({
      product,
      userData: userSnap.exists ? userSnap.data() : {},
    });
  } catch (err) {
    console.error('Purchase resolution failed:', err);
    return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }

  if (!purchase.allowed) {
    if (purchase.reason === 'already_owned') {
      // Kept as `already_enrolled` because the client already branches on it.
      return res.status(409).json({ error: 'already_enrolled', productId });
    }
    return res.status(409).json({
      error: 'missing_prerequisite',
      requires: purchase.requires,
      message: 'This is an add-on to the 7-Day Attention Reset. Start there first.',
    });
  }

  try {
    const order = await getRazorpay().orders.create({
      amount: purchase.pricePaise,
      currency: CURRENCY,
      receipt: `${productId.slice(0, 8)}_${user.uid.slice(0, 14)}_${Date.now()}`,
      // Notes come back on every fetch of this order, so verification can read
      // what we charged without trusting the browser or our own database.
      notes: {
        uid: user.uid,
        productId,
        expected_paise: String(purchase.pricePaise),
      },
    });

    // Recorded so /api/check-entitlement can reconcile later if the browser dies
    // between Razorpay taking the money and us hearing about it.
    await db
      .collection('orders')
      .doc(order.id)
      .set({
        uid: user.uid,
        product_id: productId,
        amount_paise: purchase.pricePaise,
        currency: CURRENCY,
        status: 'created',
        created_at: FieldValue.serverTimestamp(),
      })
      .catch((err) => console.error('Order record write failed:', err.message));

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      productId,
      // Echoed so the payment sheet and any receipt UI show the same number the
      // server actually charged, rather than a price the client assumed.
      priceRupees: purchase.priceRupees,
      listPriceRupees: purchase.listPriceRupees,
      discounted: purchase.discounted,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }
}
