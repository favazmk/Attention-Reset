import { auth } from './firebase';

/**
 * POST to one of our serverless routes with the caller's Firebase ID token
 * attached. Every endpoint that touches money or access requires it — the server
 * decides who you are, the browser never asserts it.
 */
export async function authedPost(path, body) {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error('not-signed-in');
    err.status = 401;
    throw err;
  }

  const token = await user.getIdToken();

  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body || {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
