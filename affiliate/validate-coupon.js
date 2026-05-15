import { getAdminDb } from './_firebase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'No coupon code provided' });
  }

  const normalizedCode = code.toUpperCase().trim();

  try {
    const db = getAdminDb();
    const couponRef = db.collection('coupons').doc(normalizedCode);
    const couponSnap = await couponRef.get();

    if (!couponSnap.exists) {
      return res.status(200).json({ valid: false, error: 'Invalid coupon code' });
    }

    const coupon = couponSnap.data();

    if (!coupon.active) {
      return res.status(200).json({ valid: false, error: 'This coupon is no longer active' });
    }

    const originalPrice = 399;
    const discountedPrice = Math.round(originalPrice * (1 - coupon.discount_percent / 100));
    const savings = originalPrice - discountedPrice;

    return res.status(200).json({
      valid: true,
      code: normalizedCode,
      influencer_name: coupon.influencer_name,
      discount_percent: coupon.discount_percent,
      discounted_price: discountedPrice,
      savings: savings,
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    return res.status(500).json({ valid: false, error: 'Server error. Please try again.' });
  }
}
