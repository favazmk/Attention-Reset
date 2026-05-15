import crypto from 'crypto';
import { getAdminDb, FieldValue } from './_firebase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    coupon_code,
    final_amount, // in rupees
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment fields' });
  }

  // ── Verify Razorpay signature ────────────────────────────────────────────────
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
  }

  // ── Payment verified — record commission if coupon was used ──────────────────
  if (coupon_code) {
    try {
      const db = getAdminDb();
      const normalizedCode = coupon_code.toUpperCase().trim();

      // Fetch coupon data again for accuracy
      const couponRef = db.collection('coupons').doc(normalizedCode);
      const couponSnap = await couponRef.get();

      if (couponSnap.exists) {
        const coupon = couponSnap.data();
        const originalPrice = 399;
        const saleAmount = final_amount || Math.round(originalPrice * (1 - coupon.discount_percent / 100));
        const commissionAmount = Math.round(saleAmount * (coupon.commission_percent / 100) * 100) / 100;
        const discountAmount = originalPrice - saleAmount;

        // Write commission record
        await db.collection('commissions').add({
          coupon_code: normalizedCode,
          influencer_name: coupon.influencer_name,
          influencer_email: coupon.influencer_email,
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          original_amount: originalPrice,
          discount_amount: discountAmount,
          sale_amount: saleAmount,
          commission_amount: commissionAmount,
          commission_percent: coupon.commission_percent,
          status: 'pending', // pending → paid (updated manually from admin panel)
          timestamp: FieldValue.serverTimestamp(),
        });

        // Increment coupon usage stats
        await couponRef.update({
          total_uses: FieldValue.increment(1),
          total_commission_earned: FieldValue.increment(commissionAmount),
        });
      }
    } catch (err) {
      // Log but don't fail the payment verification
      console.error('Commission recording error:', err);
    }
  }

  // ── Meta Conversions API ─────────────────────────────────────────────────────
  try {
    const pixelId = '799577566351233';
    const accessToken = process.env.META_CAPI_TOKEN;

    if (accessToken) {
      const eventData = {
        data: [
          {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_id: razorpay_order_id,
            custom_data: {
              currency: 'INR',
              value: final_amount || 399.00,
            },
            user_data: {
              client_ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '0.0.0.0',
              client_user_agent: req.headers['user-agent'] || '',
            },
          },
        ],
      };

      fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }).catch(err => console.error('Meta CAPI Request Error:', err));
    }
  } catch (e) {
    console.error('Meta CAPI setup error:', e);
  }

  return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
}
