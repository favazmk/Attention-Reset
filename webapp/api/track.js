import { getProduct } from './_products.js';
import { verifyRequest } from './_firebase-admin.js';
import { sendMetaEvent } from './_meta.js';

/**
 * Server-side mirror of the browser's mid-funnel pixel events.
 *
 * Unauthenticated on purpose: ViewContent fires for logged-out visitors, which
 * is nearly all paid traffic. Requiring a token here would mirror only the
 * small minority who already have an account — exactly the people Meta could
 * already see.
 *
 * Because it is open, the request cannot decide anything that matters:
 *   - only the two mid-funnel event names below are accepted
 *   - value and currency come from the server's product catalog, never the body
 *   - nothing is written to the database, and no money is involved
 * The worst an abuser achieves is inflating a ViewContent count, which Meta
 * dedupes by `eventId` anyway.
 *
 * Purchase is deliberately NOT here — it is sent from verify-payment.js only,
 * after Razorpay has confirmed the money, so it can never be faked.
 */
const ALLOWED_EVENTS = new Set(['ViewContent', 'InitiateCheckout']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventName, eventId, productId, eventSourceUrl } = req.body || {};

  if (!ALLOWED_EVENTS.has(eventName)) {
    return res.status(400).json({ error: 'Unsupported event.' });
  }
  if (typeof eventId !== 'string' || eventId.length < 8 || eventId.length > 100) {
    return res.status(400).json({ error: 'Missing or invalid eventId.' });
  }

  const product = getProduct(productId);
  if (!product) {
    return res.status(400).json({ error: 'Unknown product.' });
  }

  // A token is optional here, but when one is present it lifts match quality a
  // long way — a hashed email and uid are far stronger signals than an IP.
  let user = null;
  try {
    user = await verifyRequest(req);
  } catch {
    user = null;
  }

  sendMetaEvent(req, {
    eventName,
    eventId,
    eventSourceUrl,
    customData: {
      currency: 'INR',
      value: product.priceRupees,
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
    },
    email: user?.email,
    uid: user?.uid,
  });

  return res.status(202).json({ ok: true });
}
