/**
 * Absolute Minimal Firestore Test - Required Fields Only
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log('\n🧪 Testing absolute minimal Firestore write...\n');

  const testProperty = {
    title: 'Test',
    userId: 'seed_user_demo',
    status: 'AVAILABLE',
  };

  try {
    console.log('Minimal property data:', testProperty);
    console.log('\nAttempting to write to properties collection...');

    const docRef = await addDoc(collection(db, 'properties'), testProperty);
    console.log('\n✅ SUCCESS! Document created with ID:', docRef.id);
    console.log('The security rules and database connection are working!');
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
    console.error('\nFull error code:', error.code);
    console.error('\nThis might mean:');
    console.error('1. Firestore database is not created in Firebase Console');
    console.error('2. Security rules are blocking the write');
    console.error('3. There is a network/connectivity issue');
    console.error('\nPlease check: https://console.firebase.google.com/project/easyhome-334dd/firestore');
  }

  process.exit(0);
}

testWrite();
