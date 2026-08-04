import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// These values are public by design — Firebase web config is not a secret.
// Access control lives in Firebase Auth and the rules in /firestore.rules.
const firebaseConfig = {
  apiKey: 'AIzaSyC9UFFOSgP0fTKCjwm0zbZmTv-mz3L_VKE',
  authDomain: 'valued-module-483416-k8.firebaseapp.com',
  projectId: 'valued-module-483416-k8',
  storageBucket: 'valued-module-483416-k8.appspot.com',
  messagingSenderId: '219996572084',
  appId: '1:219996572084:web:1426628f23a1d527fa8ae1',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

let firestorePromise;

/**
 * Firestore is only ever needed once someone is signed in, and it is the single
 * largest piece of the Firebase SDK. Loading it on demand keeps it off the
 * critical path for landing-page visitors, who are most of the traffic.
 *
 * Resolves to the whole firebase/firestore module plus a ready `db` instance.
 */
export function getDb() {
  if (!firestorePromise) {
    firestorePromise = import('firebase/firestore').then((firestore) => ({
      ...firestore,
      db: firestore.getFirestore(app),
    }));
  }
  return firestorePromise;
}
