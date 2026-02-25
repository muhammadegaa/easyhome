/**
 * Firestore Seed Script - 50 Indonesian Properties
 * CORRECTED STRUCTURE - matches app/properties/new/page.js
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

const SEED_USER_ID = 'seed_user_demo';

// 10 handcrafted properties
const properties = [
  {
    title: 'Villa Modern di Canggu dengan Private Pool',
    description: 'Villa mewah 3 kamar dengan kolam renang pribadi dan pemandangan sawah. Dekat dengan pantai Canggu dan area komersial. Fully furnished dengan perabotan berkualitas tinggi. Cocok untuk keluarga atau investasi villa rental dengan ROI tinggi.',
    propertyType: 'VILLA',
    listingType: 'SALE',
    price: 4500000000,
    address: 'Jl. Pantai Berawa No. 88',
    city: 'Badung',
    province: 'Bali',
    zipCode: '80361',
    landArea: 250,
    buildingArea: 180,
    bedrooms: 3,
    bathrooms: 3,
    carports: 2,
    floors: 2,
    furnished: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
  },
  {
    title: 'Apartemen Jakarta Selatan - Pacific Place Residences',
    description: 'Apartemen mewah 2BR di pusat SCBD dengan pemandangan kota yang menakjubkan. Akses mudah ke mall, perkantoran, dan transportasi umum. Fully furnished dengan interior modern minimalis dan kitchen set lengkap.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 6800000000,
    address: 'Jl. Jend. Sudirman Kav. 52-53',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    zipCode: '12190',
    landArea: 0,
    buildingArea: 110,
    bedrooms: 2,
    bathrooms: 2,
    carports: 0,
    floors: 1,
    furnished: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
  },
  {
    title: 'Rumah Minimalis 2 Lantai di BSD City',
    description: 'Rumah modern minimalis dalam cluster elite BSD. Lingkungan asri dan aman dengan fasilitas lengkap. Dekat dengan sekolah internasional, mall, dan rumah sakit. Cocok untuk keluarga yang menginginkan kenyamanan dan keamanan.',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 2850000000,
    address: 'Cluster Emerald, BSD City',
    city: 'Tangerang Selatan',
    province: 'Banten',
    zipCode: '15345',
    landArea: 200,
    buildingArea: 150,
    bedrooms: 4,
    bathrooms: 3,
    carports: 2,
    floors: 2,
    furnished: false,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    ],
  },
  {
    title: 'Ruko 3 Lantai Strategic Location Surabaya',
    description: 'Ruko strategis di jalan protokol Surabaya dengan traffic tinggi. Cocok untuk berbagai jenis usaha retail, kantor, atau restoran. Lokasi sangat ramai dan mudah diakses. Parkir luas untuk kendaraan customer.',
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    price: 5200000000,
    address: 'Jl. Raya Darmo No. 128',
    city: 'Surabaya',
    province: 'Jawa Timur',
    zipCode: '60264',
    landArea: 100,
    buildingArea: 240,
    bedrooms: 1,
    bathrooms: 3,
    carports: 2,
    floors: 3,
    furnished: false,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    ],
  },
  {
    title: 'Townhouse Bandung Utara View Pegunungan',
    description: 'Townhouse asri dengan view pegunungan yang indah. Udara sejuk dan tenang. Dekat dengan tempat wisata Lembang dan Dago. Cocok untuk keluarga yang menginginkan suasana sejuk dan alami di tengah kota.',
    propertyType: 'TOWNHOUSE',
    listingType: 'SALE',
    price: 1950000000,
    address: 'Jl. Setiabudhi No. 245',
    city: 'Bandung',
    province: 'Jawa Barat',
    zipCode: '40154',
    landArea: 120,
    buildingArea: 100,
    bedrooms: 3,
    bathrooms: 2,
    carports: 1,
    floors: 2,
    furnished: false,
    images: [
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    ],
  },
  {
    title: 'Penthouse Mewah Pondok Indah Jakarta',
    description: 'Penthouse eksklusif dengan 360 derajat city view yang spektakuler. Fasilitas premium dan lokasi prestisius. Interior design by award-winning architect. Private lift access langsung ke unit. Lifestyle apartment terbaik di Jakarta Selatan.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 15500000000,
    address: 'Pondok Indah Residence',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    zipCode: '12310',
    landArea: 0,
    buildingArea: 380,
    bedrooms: 4,
    bathrooms: 4,
    carports: 0,
    floors: 2,
    furnished: true,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
  },
  {
    title: 'Villa Ubud dengan Rice Field View',
    description: 'Villa tradisional Bali dengan sentuhan modern yang harmonis. Pemandangan sawah yang menakjubkan dari setiap sudut villa. Cocok untuk retreat, vacation home, atau investasi villa rental. Lokasi tenang dan damai.',
    propertyType: 'VILLA',
    listingType: 'SALE',
    price: 3200000000,
    address: 'Jl. Raya Tegallalang',
    city: 'Gianyar',
    province: 'Bali',
    zipCode: '80571',
    landArea: 300,
    buildingArea: 120,
    bedrooms: 2,
    bathrooms: 2,
    carports: 1,
    floors: 1,
    furnished: true,
    images: [
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800',
    ],
  },
  {
    title: 'Rumah Mewah Menteng Jakarta Pusat',
    description: 'Rumah klasik kolonial di kawasan elite Menteng yang prestisius. Tanah luas dengan taman yang sangat asri dan terawat. Arsitektur timeless yang tetap indah sepanjang masa. Lokasi strategis di jantung Jakarta dengan nilai investasi tinggi.',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 28000000000,
    address: 'Jl. Menteng Raya No. 15',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    zipCode: '10340',
    landArea: 800,
    buildingArea: 500,
    bedrooms: 6,
    bathrooms: 5,
    carports: 4,
    floors: 2,
    furnished: true,
    yearBuilt: 1975,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
  },
  {
    title: 'Studio Apartment Margonda Depok',
    description: 'Studio apartment strategis dekat UI dan Margonda dengan traffic mahasiswa sangat tinggi. Cocok untuk mahasiswa atau investasi kos-kosan dengan ROI menarik. Fully furnished siap huni dengan AC, kitchen set, dan wifi.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: 425000000,
    address: 'Margonda Residence 3',
    city: 'Depok',
    province: 'Jawa Barat',
    zipCode: '16424',
    landArea: 0,
    buildingArea: 24,
    bedrooms: 1,
    bathrooms: 1,
    carports: 0,
    floors: 1,
    furnished: true,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    ],
  },
  {
    title: 'Rumah Subsidi Siap Huni Bekasi',
    description: 'Rumah subsidi lokasi strategis Bekasi dengan akses mudah ke tol dan stasiun commuter line. Cocok untuk keluarga muda yang ingin memiliki rumah pertama. Cluster aman dengan fasilitas playground dan masjid.',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: 285000000,
    address: 'Cluster Griya Asri, Bekasi',
    city: 'Bekasi',
    province: 'Jawa Barat',
    zipCode: '17530',
    landArea: 60,
    buildingArea: 36,
    bedrooms: 2,
    bathrooms: 1,
    carports: 1,
    floors: 1,
    furnished: false,
    images: [
      'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800',
    ],
  },
];

// Generate 40 more properties
const cities = [
  { name: 'Jakarta Selatan', province: 'DKI Jakarta' },
  { name: 'Bandung', province: 'Jawa Barat' },
  { name: 'Surabaya', province: 'Jawa Timur' },
  { name: 'Yogyakarta', province: 'DI Yogyakarta' },
  { name: 'Semarang', province: 'Jawa Tengah' },
  { name: 'Tangerang', province: 'Banten' },
  { name: 'Badung', province: 'Bali' },
  { name: 'Denpasar', province: 'Bali' },
];

const propertyTypes = ['HOUSE', 'APARTMENT', 'VILLA', 'TOWNHOUSE', 'COMMERCIAL'];
const prices = [350000000, 850000000, 1500000000, 2800000000, 5500000000, 12000000000];

for (let i = 0; i < 40; i++) {
  const city = cities[i % cities.length];
  const propertyType = propertyTypes[i % propertyTypes.length];
  const basePrice = prices[i % prices.length];
  const price = basePrice + Math.floor(Math.random() * 500000000);
  const isApartment = propertyType === 'APARTMENT';

  properties.push({
    title: `${propertyType === 'HOUSE' ? 'Rumah' : propertyType === 'APARTMENT' ? 'Apartemen' : propertyType === 'VILLA' ? 'Villa' : propertyType === 'TOWNHOUSE' ? 'Townhouse' : 'Ruko'} ${city.name} Premium ${i + 11}`,
    description: `Properti ${propertyType.toLowerCase()} strategis di ${city.name}. Lokasi premium dengan fasilitas lengkap dan akses mudah. Cocok untuk investasi atau hunian keluarga. Lingkungan aman dan nyaman dengan nilai investasi yang terus meningkat.`,
    propertyType,
    listingType: 'SALE',
    price,
    address: `Jl. ${city.name} Raya No. ${Math.floor(Math.random() * 200) + 1}`,
    city: city.name,
    province: city.province,
    zipCode: `${10000 + i}`,
    landArea: isApartment ? 0 : Math.floor(Math.random() * 300) + 100,
    buildingArea: Math.floor(Math.random() * 200) + 50,
    bedrooms: Math.floor(Math.random() * 4) + 2,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    carports: isApartment ? 0 : Math.floor(Math.random() * 3) + 1,
    floors: isApartment ? 1 : Math.floor(Math.random() * 2) + 1,
    furnished: Math.random() > 0.5,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    ],
  });
}

async function seedProperties() {
  console.log('🌱 Starting Firestore seed...');
  console.log(`📝 Will create ${properties.length} properties\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];

    try {
      const propertyData = {
        ...property,
        userId: SEED_USER_ID,
        status: 'AVAILABLE',
        viewCount: Math.floor(Math.random() * 1000), // Random views for realistic demo data
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'properties'), propertyData);
      successCount++;
      console.log(`✅ [${i + 1}/${properties.length}] ${property.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${properties.length}] ${property.title}`);
      console.error(`   Error: ${error.message}\n`);
    }
  }

  console.log('\n🎉 Seed completed!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  process.exit(0);
}

seedProperties();
