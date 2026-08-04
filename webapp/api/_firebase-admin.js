import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function ensureApp() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount) });
  }
}

let adminDb;

export function getAdminDb() {
  if (!adminDb) {
    ensureApp();
    adminDb = getFirestore();
  }
  return adminDb;
}

export function getAdminAuth() {
  ensureApp();
  return getAuth();
}

/**
 * Verifies the Firebase ID token on the Authorization header.
 * Returns the decoded token, or null if the request is unauthenticated.
 * Never throws on a bad token — callers decide how to respond.
 */
export async function verifyRequest(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;

  try {
    return await getAdminAuth().verifyIdToken(header.slice(7));
  } catch (err) {
    console.error('ID token verification failed:', err.message);
    return null;
  }
}

export { FieldValue };
