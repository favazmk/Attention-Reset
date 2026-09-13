import { getAdminDb, verifyRequest } from './_firebase-admin.js';
import { readEntitlements } from './_products.js';
import { WEEKS } from './_deepwork-content.js';

/**
 * The Deep Work System's material, for people who bought it.
 *
 * This is the paywall. Previously the programme was a bundled chunk, which made
 * the check in `App.jsx` the only thing standing between a visitor and the
 * content — and that check runs in the browser, on state the browser holds. A
 * static chunk has no idea who is asking. This endpoint does.
 *
 * Entitlement is read from Firestore on every request rather than trusted from
 * the caller, so a refund or a revoked grant takes effect on the next load.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await verifyRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not signed in.' });
  }

  let owned;
  try {
    const snap = await getAdminDb().collection('users').doc(user.uid).get();
    owned = readEntitlements(snap.exists ? snap.data() : {});
  } catch (err) {
    console.error('Deep Work entitlement read failed:', err);
    return res.status(500).json({ error: 'Could not load the programme right now.' });
  }

  if (!owned.deepwork) {
    return res.status(403).json({
      error: 'not_entitled',
      message: 'The Deep Work System is a separate add-on.',
    });
  }

  // Private: it is per-user paid material, so no shared cache may hold it.
  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(200).json({ weeks: WEEKS });
}
