import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

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

export const isFirebaseConfigured = (): boolean => {
  const invalidKeywords = ["placeholder", "fakekey", "demo", "example", "missing", "undefined"];
  
  const valuesToCheck = [
    firebaseConfig.apiKey,
    firebaseConfig.projectId,
    firebaseConfig.authDomain,
    firebaseConfig.appId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId
  ];

  for (const value of valuesToCheck) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return false;
    }
    const lowerValue = value.toLowerCase();
    for (const keyword of invalidKeywords) {
      if (lowerValue.includes(keyword)) {
        return false;
      }
    }
  }

  if (firebaseConfig.projectId === "govai-connect" && !metaEnv.VITE_FIREBASE_PROJECT_ID) {
    return false;
  }
  if (firebaseConfig.messagingSenderId === "123456789012" && !metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID) {
    return false;
  }

  return true;
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
}

// We cast these as any to avoid changing every consumer's type checking,
// since consumers should only call these if isFirebaseConfigured() is true.
const exportedApp = app as any;
const exportedDb = db as any as Firestore;
const exportedAuth = auth as any as Auth;
const exportedStorage = storage as any as FirebaseStorage;

export { 
  exportedApp as app, 
  exportedDb as db, 
  exportedAuth as auth, 
  exportedStorage as storage 
};
export default exportedApp;
