import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgmklXue5z4qfwAeE6JcB6BegmftFnuAc",
  authDomain: "cleaninghub-26fa2.firebaseapp.com",
  projectId: "cleaninghub-26fa2",
  storageBucket: "cleaninghub-26fa2.firebasestorage.app",
  messagingSenderId: "246703497527",
  appId: "1:246703497527:web:8f21c71201e74b77473ab2",
  measurementId: "G-79J8HM6RL6"
};

// Safely initialize Firebase app
let app: FirebaseApp;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.warn("Firebase initialization failed during build time:", error instanceof Error ? error.message : String(error));
  // Create a mock app object for build time
  app = {} as FirebaseApp;
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;