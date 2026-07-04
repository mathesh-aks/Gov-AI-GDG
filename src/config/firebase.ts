import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const metaEnv = (import.meta as any).env || {};

// Standard client-side Firebase configuration.
// In development, values default to placeholders.
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyFakeKey_GovAIC_Placeholder",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "govai-connect.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "govai-connect",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "govai-connect.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:123456789012:web:1234567890abc"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
