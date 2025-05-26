
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database'; // Added Realtime Database import
import { getAnalytics, type Analytics } from 'firebase/analytics'; // Added Analytics import

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Ensure this is used
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore; // Firestore instance
let rtdb: Database; // Realtime Database instance
let analytics: Analytics | undefined; // Analytics instance, can be undefined if not supported

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app); // Initialize Firestore
rtdb = getDatabase(app); // Initialize Realtime Database

// Initialize Analytics only in browser environment
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics could not be initialized:", error);
    // This can happen in environments where Analytics is not supported (e.g. server-side during SSR build)
  }
}


export { app, auth, db, rtdb, analytics }; // Export db, rtdb, and analytics
