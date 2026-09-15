import { auth } from './firebase';

/**
 * Fires one pixel event twice — once from the browser, once from our server —
 * sharing a single `eventID` so Meta collapses them into one.
 *
 * Sending both is the point. The browser copy carries the richest context but
 * is blocked for a large share of real traffic; the server copy always gets
 * through. Whichever arrives, Meta sees exactly one event.
 *
 * Purchase is not sent through here. It is fired by the browser at the moment
 * of success and by `verify-payment.js` after Razorpay confirms the money, so
 * a conversion can never be reported for a payment that did not happen.
 */
export function trackEvent(eventName, { productId = 'reset7', value, currency = 'INR' } = {}) {
  const eventId = newEventId();

  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, { value, currency, content_ids: [productId] }, { eventID: eventId });
  }

  sendToServer({ eventName, eventId, productId });

  return eventId;
}

async function sendToServer({ eventName, eventId, productId }) {
  try {
    const headers = { 'Content-Type': 'application/json' };

    // Optional: most callers here are logged out. When a token is available it
    // materially improves Meta's match rate, so it is attached when it exists.
    const user = auth.currentUser;
    if (user) {
      try {
        headers.Authorization = `Bearer ${await user.getIdToken()}`;
      } catch {
        /* an expired token must not stop the event being sent */
      }
    }

    await fetch('/api/track', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventName,
        eventId,
        productId,
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never surface to the user or break a flow.
  }
}

function newEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `e_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
