import Razorpay from 'razorpay';
import { getAdminDb } from './_firebase-admin.js';

const ORIGINAL_PRICE = 39900; // ₹399 in paise

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency = 'INR', receipt = 'receipt_' + Date.now(), coupon_code } = req.body;
  let finalAmount = ORIGINAL_PRICE;
  let couponData = null;

  // ── Validate coupon if provided ──────────────────────────────────────────────
  if (coupon_code) {
    try {
      const db = getAdminDb();
      const normalizedCode = coupon_code.toUpperCase().trim();
      const couponSnap = await db.collection('coupons').doc(normalizedCode).get();

      if (couponSnap.exists && couponSnap.data().active) {
        const coupon = couponSnap.data();
        const originalPrice = 399; // in rupees
        const discountedPrice = Math.round(originalPrice * (1 - coupon.discount_percent / 100));
        finalAmount = discountedPrice * 100; // convert to paise
        couponData = {
          code: normalizedCode,
          influencer_name: coupon.influencer_name,
          influencer_email: coupon.influencer_email,
          discount_percent: coupon.discount_percent,
          commission_percent: coupon.commission_percent,
          final_amount_rupees: discountedPrice,
        };
      }
    } catch (err) {
      console.error('Coupon validation in create-order failed:', err);
      // Non-blocking — fall back to original price
    }
  }

  if (!finalAmount || finalAmount < 100) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  // ── Create Razorpay order ────────────────────────────────────────────────────
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency,
      receipt,
      notes: coupon_code
        ? { coupon_code: couponData.code, influencer: couponData.influencer_name }
        : {},
    });

    return res.status(200).json({
      ...order,
      coupon_applied: !!couponData,
      coupon: couponData,
    });

  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
}
