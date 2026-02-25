/**
 * Firebase Configuration
 *
 * Initializes Firebase app with environment variables
 * Uses Firebase v9+ modular SDK for better tree-shaking and performance
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Validate Firebase configuration
 * Ensures all required environment variables are set
 */
const validateConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

  if (missingFields.length > 0) {
    console.warn(
      `Firebase config missing: ${missingFields.join(', ')}. ` +
      'Firebase features will not work. Please set environment variables.'
    );
    return false;
  }

  return true;
};

// Initialize Firebase (only once)
let app;
let auth;
let db;
let storage;

try {
  if (validateConfig()) {
    // Check if app is already initialized
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

/**
 * Check if Firebase is configured and ready to use
 * @returns {boolean} True if Firebase is initialized
 */
export const isFirebaseConfigured = () => {
  return !!(app && auth && db && storage);
};

export { app, auth, db, storage };
export default app;
