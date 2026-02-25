/**
 * Minimal Firestore Test - Single Property Write
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log('🧪 Testing minimal Firestore write...\n');

  const testProperty = {
    title: 'Test Property',
    description: 'Simple test property',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 1000000000,
    address: 'Jl. Test No. 1',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    zipCode: '12345',
    landArea: 100,
    buildingArea: 80,
    bedrooms: 3,
    bathrooms: 2,
    carports: 1,
    floors: 1,
    furnished: false,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    userId: 'seed_user_demo',
    status: 'AVAILABLE',
    viewCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  try {
    console.log('Property data:', JSON.stringify(testProperty, null, 2));
    console.log('\nAttempting to write...');

    const docRef = await addDoc(collection(db, 'properties'), testProperty);
    console.log('✅ SUCCESS! Document created with ID:', docRef.id);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.error('Full error:', error);
  }

  process.exit(0);
}

testWrite();
