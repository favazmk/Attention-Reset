const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least 100 paise' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};
