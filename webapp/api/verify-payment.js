import crypto from 'crypto';
import { verifyRequest } from './_firebase-admin.js';
import { getRazorpay, grantEntitlement } from './_entitlement.js';
import { DEFAULT_PRODUCT_ID, getProduct, toPaise } from './_products.js';
import { sendMetaEvent } from './_meta.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not signed in.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment fields' });
  }

  // ── 1. Signature check — proves Razorpay produced this order/payment pair ────
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const provided = Buffer.from(String(razorpay_signature), 'utf8');
  const computed = Buffer.from(expected, 'utf8');
  const signatureValid =
    provided.length === computed.length && crypto.timingSafeEqual(provided, computed);

  if (!signatureValid) {
    return res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
  }

  // ── 2. Ask Razorpay what actually happened ──────────────────────────────────
  // A valid signature only proves the pair is genuine. It says nothing about who
  // owns the order or how much was paid, so both come from Razorpay, not the body.
  let order;
  try {
    order = await getRazorpay().orders.fetch(razorpay_order_id);
  } catch (err) {
    console.error('Order fetch failed:', err);
    return res.status(502).json({ status: 'failure', message: 'Could not confirm the payment. Please contact support.' });
  }

  if (order.notes?.uid !== user.uid) {
    return res.status(403).json({ status: 'failure', message: 'This order belongs to another account.' });
  }

  if (order.status !== 'paid') {
    return res.status(409).json({ status: 'pending', message: 'Payment has not been captured yet.' });
  }

  // Which product, and what we charged for it, both come from the notes we set
  // when the order was created — Razorpay hands them back unchanged. Reading
  // the expectation from here rather than recomputing it means a price change
  // or an expired new-buyer window can never retroactively invalidate a payment
  // someone already made at the old price.
  //
  // Known, accepted consequence: a Razorpay order does not expire, so an
  // eligible user could create a discounted order inside the 48-hour window and
  // pay it weeks later, keeping the new-buyer price. That is deliberate. The
  // alternative — re-checking eligibility here — means rejecting a payment
  // Razorpay has already captured, which takes someone's money and refuses them
  // the product. Losing the discount margin on a rare, non-scalable, single-use
  // case is the better failure. Do not "fix" this by adding a window check
  // after capture.
  const productId = order.notes?.productId || DEFAULT_PRODUCT_ID;
  const product = getProduct(productId);
  if (!product) {
    console.error(`Order ${order.id} names unknown product ${productId}`);
    return res.status(400).json({ status: 'failure', message: 'Unknown product on this order.' });
  }

  const expectedPaise = Number(order.notes?.expected_paise) || toPaise(product.priceRupees);

  if (Number(order.amount_paid) < expectedPaise) {
    console.error(`Underpaid order ${order.id}: ${order.amount_paid} < ${expectedPaise}`);
    return res.status(400).json({ status: 'failure', message: 'Payment amount did not match.' });
  }

  // ── 3. Grant access (idempotent — replays are recognised and do nothing) ────
  let firstTime;
  try {
    ({ firstTime } = await grantEntitlement({
      uid: user.uid,
      productId,
      orderId: order.id,
      paymentId: razorpay_payment_id,
      amountPaise: Number(order.amount_paid),
      expectedPaise,
    }));
  } catch (err) {
    console.error('Entitlement grant failed:', err);
    return res.status(500).json({
      status: 'failure',
      message: 'Your payment went through but access could not be enabled. Please contact support.',
    });
  }

  // ── 4. Meta Conversions API — only on the first grant, never on replays ─────
  if (firstTime) {
    sendMetaEvent(req, {
      eventName: 'Purchase',
      // The browser pixel uses the order id as its eventID for this same
      // purchase, so Meta collapses the two into one conversion.
      eventId: order.id,
      customData: {
        currency: 'INR',
        value: Number(order.amount_paid) / 100,
        content_name: product.name,
        content_ids: [productId],
        content_type: 'product',
      },
      email: user.email,
      uid: user.uid,
    });
  }

  return res.status(200).json({ status: 'success', enrolled: true, productId });
}
