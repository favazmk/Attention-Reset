import crypto from 'crypto';

/**
 * Conversions API sender.
 *
 * The browser pixel is blocked or crippled for a large share of real traffic —
 * iOS, ad blockers, privacy modes. Anything Meta needs to optimise against has
 * to be sent from here as well, with a matching `event_id` so the two copies
 * dedupe into one event rather than double-counting.
 *
 * Match quality is what decides whether Meta can attribute a conversion to the
 * ad that caused it, so every identifier we legitimately have goes in:
 *   fbc  — the click ID from the ad the user clicked. The strongest signal.
 *   fbp  — the pixel's own browser ID, set on first visit.
 *   em   — hashed email, for signed-in users.
 *   external_id — hashed uid, stable across that user's devices.
 */

const PIXEL_ID = '799577566351233';
const API_VERSION = 'v19.0';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Meta requires email and external_id hashed; fbp/fbc/ip/ua must stay raw. */
export function buildUserData(req, { email, uid } = {}) {
  const cookies = parseCookies(req.headers?.cookie);

  const userData = {
    client_ip_address: (req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: req.headers?.['user-agent'] || undefined,
  };

  if (cookies._fbp) userData.fbp = cookies._fbp;
  if (cookies._fbc) userData.fbc = cookies._fbc;
  if (email) userData.em = [sha256(email.trim().toLowerCase())];
  if (uid) userData.external_id = [sha256(uid)];

  return userData;
}

/**
 * Fire-and-forget: a failed analytics call must never fail the request that
 * triggered it. Purchases in particular are already recorded and granted by the
 * time this runs.
 */
export function sendMetaEvent(req, { eventName, eventId, eventSourceUrl, customData, email, uid }) {
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!accessToken) return;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        // Must match the browser pixel's eventID for the same action, or Meta
        // counts one conversion twice.
        event_id: eventId,
        event_source_url: eventSourceUrl || undefined,
        custom_data: customData,
        user_data: buildUserData(req, { email, uid }),
      },
    ],
  };

  fetch(`https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error(`Meta CAPI ${eventName} rejected (${res.status}):`, body.slice(0, 300));
      }
    })
    .catch((err) => console.error(`Meta CAPI ${eventName} request error:`, err.message));
}

function parseCookies(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const i = part.indexOf('=');
    if (i > 0) acc[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    return acc;
  }, {});
}
