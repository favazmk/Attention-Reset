import { getAdminDb, verifyRequest } from './_firebase-admin.js';
import { PRODUCTS, getProduct, readEntitlements, resolvePurchase } from './_products.js';

/**
 * What this user owns, and what the add-on would cost them right now.
 *
 * The new-buyer price depends on when they enrolled, which only the server
 * knows, so the offer screen cannot work out its own price — it asks. That also
 * means the number on the offer screen and the number Razorpay charges come
 * from the same function, and cannot drift apart.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not signed in.' });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('users').doc(user.uid).get();
    const userData = snap.exists ? snap.data() : {};

    const now = Date.now();
    const entitlements = readEntitlements(userData);
    const product = getProduct('deepwork');
    const purchase = resolvePurchase({ product, userData, now });

    let offerEndsAt = null;
    if (purchase.allowed && purchase.discounted) {
      const enrolledAtMs = userData.enrolled_at?.toMillis?.() ?? null;
      if (enrolledAtMs) {
        offerEndsAt = enrolledAtMs + product.offer.windowHours * 60 * 60 * 1000;
      }
    }

    return res.status(200).json({
      entitlements,
      deepwork: {
        name: product.name,
        allowed: purchase.allowed,
        reason: purchase.reason || null,
        priceRupees: purchase.priceRupees ?? product.priceRupees,
        listPriceRupees: product.listPriceRupees,
        discounted: purchase.discounted ?? false,
        // Absolute epoch millis, not a duration — a tab left open overnight
        // must not still believe it has 40 hours left.
        offerEndsAt,
      },
      products: Object.values(PRODUCTS).map((p) => ({ id: p.id, name: p.name })),
    });
  } catch (err) {
    console.error('Offer lookup failed:', err);
    return res.status(500).json({ error: 'Could not load the offer right now.' });
  }
}
