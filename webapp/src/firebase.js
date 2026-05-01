// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9UFFOSgP0fTKCjwm0zbZmTv-mz3L_VKE",
  authDomain: "valued-module-483416-k8.firebaseapp.com",
  projectId: "valued-module-483416-k8",
  storageBucket: "valued-module-483416-k8.appspot.com",
  messagingSenderId: "219996572084",
  appId: "1:219996572084:web:1426628f23a1d527fa8ae1",
  measurementId: "G-0HM55KZRBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
