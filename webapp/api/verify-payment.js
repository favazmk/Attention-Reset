import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment fields' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // ---------------------------------------------------------
    // META CONVERSIONS API (CAPI) - Purchase Event
    // ---------------------------------------------------------
    try {
      const pixelId = '799577566351233'; // Your Meta Pixel ID
      const accessToken = process.env.META_CAPI_TOKEN; 
      
      if (accessToken) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        
        const eventData = {
          data: [
            {
              event_name: 'Purchase',
              event_time: currentTimestamp,
              action_source: 'website',
              event_id: razorpay_order_id, // For deduplication with browser pixel
              custom_data: {
                currency: 'INR',
                value: 399.00
              },
              user_data: {
                client_ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '0.0.0.0',
                client_user_agent: req.headers['user-agent'] || ''
              }
            }
          ]
        };

        fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        }).catch(err => console.error('Meta CAPI Request Error:', err));
      } else {
        console.warn('META_CAPI_TOKEN is missing in environment variables');
      }
    } catch (e) {
      console.error('Meta CAPI setup error:', e);
    }
    // ---------------------------------------------------------

    return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    return res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
  }
};
