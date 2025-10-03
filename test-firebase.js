// Temporary test script to verify Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCgmklXue5z4qfwAeE6JcB6BegmftFnuAc",
  authDomain: "cleanhub-26fa2.firebaseapp.com",
  projectId: "cleanhub-26fa2",
  storageBucket: "cleanhub-26fa2.firebasestorage.app",
  messagingSenderId: "246703497527",
  appId: "1:246703497527:web:9ac5ddfb8921df21473ab2"
};

try {
  console.log('Testing Firebase configuration...');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Auth instance created');
  console.log('API Key appears to be valid');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('Error code:', error.code);
  if (error.code === 'auth/invalid-api-key') {
    console.error('The API key is invalid or expired. Please check your Firebase console.');
  }
}