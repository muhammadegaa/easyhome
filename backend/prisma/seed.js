import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.propertyImage.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const seller1 = await prisma.user.create({
    data: {
      email: 'seller1@easyhome.com',
      password: hashedPassword,
      name: 'Budi Santoso',
      phone: '081234567890',
      role: 'SELLER',
      isVerified: true,
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'seller2@easyhome.com',
      password: hashedPassword,
      name: 'Siti Nurhaliza',
      phone: '081234567891',
      role: 'SELLER',
      isVerified: true,
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: 'developer@easyhome.com',
      password: hashedPassword,
      name: 'PT Properti Sejahtera',
      phone: '081234567892',
      role: 'DEVELOPER',
      isVerified: true,
    },
  });

  console.log('✅ Created users');

  // Sample properties
  const properties = [
    {
      ownerId: seller1.id,
      title: 'Modern Minimalist House in BSD City',
      description: 'Beautiful 2-story house with modern minimalist design. Located in prestigious BSD City area with excellent facilities. Close to schools, shopping centers, and easy access to toll road. Perfect for family living with spacious rooms and natural lighting.',
      propertyType: 'HOUSE',
      listingType: 'SALE',
      price: 2500000000,
      address: 'Jl. Pahlawan Seribu No. 45',
      city: 'Tangerang Selatan',
      province: 'Banten',
      zipCode: '15310',
      landArea: 120,
      buildingArea: 150,
      bedrooms: 4,
      bathrooms: 3,
      floors: 2,
      carports: 2,
      yearBuilt: 2020,
      certificate: 'SHM',
      furnished: true,
      status: 'AVAILABLE',
    },
    {
      ownerId: seller1.id,
      title: 'Luxury Villa with Ocean View in Bali',
      description: 'Stunning luxury villa with breathtaking ocean view in Uluwatu. Features infinity pool, modern kitchen, and spacious living areas. Perfect for investment or personal retreat. Walking distance to famous beaches and surf spots.',
      propertyType: 'VILLA',
      listingType: 'SALE',
      price: 8500000000,
      address: 'Jl. Pantai Suluban No. 12',
      city: 'Badung',
      province: 'Bali',
      zipCode: '80361',
      landArea: 300,
      buildingArea: 250,
      bedrooms: 5,
      bathrooms: 4,
      floors: 2,
      carports: 3,
      yearBuilt: 2019,
      certificate: 'SHM',
      furnished: true,
      status: 'AVAILABLE',
    },
    {
      ownerId: seller2.id,
      title: 'Strategic Office Space in SCBD',
      description: 'Prime commercial office space in the heart of SCBD Jakarta. Grade A building with 24/7 security, modern facilities, and excellent connectivity. Ideal for corporate offices, startups, or coworking spaces. Surrounded by restaurants and amenities.',
      propertyType: 'COMMERCIAL',
      listingType: 'RENT',
      price: 150000000,
      address: 'Jl. Jenderal Sudirman Kav. 52-53',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      zipCode: '12190',
      landArea: 0,
      buildingArea: 200,
      bedrooms: 0,
      bathrooms: 2,
      floors: 1,
      carports: 4,
      yearBuilt: 2018,
      certificate: 'SHGB',
      furnished: false,
      status: 'AVAILABLE',
    },
    {
      ownerId: seller2.id,
      title: 'Cozy Apartment in Kemang Village',
      description: 'Fully furnished 2BR apartment in trendy Kemang area. Modern interior design with premium appliances. Building facilities include swimming pool, gym, and 24-hour security. Close to international schools, restaurants, and entertainment.',
      propertyType: 'APARTMENT',
      listingType: 'RENT',
      price: 35000000,
      address: 'Jl. Kemang Raya No. 3',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      zipCode: '12730',
      landArea: 0,
      buildingArea: 85,
      bedrooms: 2,
      bathrooms: 2,
      floors: 1,
      carports: 1,
      yearBuilt: 2021,
      certificate: 'Strata Title',
      furnished: true,
      status: 'AVAILABLE',
    },
    {
      ownerId: developer.id,
      title: 'Investment Land in Sentul City',
      description: 'Prime development land in rapidly growing Sentul City area. Flat terrain with clear certificate and ready to build. Excellent for residential or commercial development. Strategic location with easy access to Jakarta and Bogor.',
      propertyType: 'LAND',
      listingType: 'SALE',
      price: 3000000000,
      address: 'Jl. MH Thamrin Sentul',
      city: 'Bogor',
      province: 'Jawa Barat',
      zipCode: '16810',
      landArea: 1000,
      buildingArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      floors: 0,
      carports: 0,
      yearBuilt: null,
      certificate: 'SHM',
      furnished: false,
      status: 'AVAILABLE',
    },
    {
      ownerId: developer.id,
      title: 'Smart Home in Alam Sutera',
      description: 'Cutting-edge smart home with IoT integration. Control everything from your phone - lighting, AC, security cameras. Energy-efficient design with solar panels. Modern architecture in secure gated community with excellent facilities.',
      propertyType: 'HOUSE',
      listingType: 'SALE',
      price: 4200000000,
      address: 'Jl. Alam Sutera Boulevard Kav. 25',
      city: 'Tangerang',
      province: 'Banten',
      zipCode: '15143',
      landArea: 160,
      buildingArea: 200,
      bedrooms: 4,
      bathrooms: 3,
      floors: 2,
      carports: 2,
      yearBuilt: 2022,
      certificate: 'SHM',
      furnished: true,
      status: 'AVAILABLE',
    },
    {
      ownerId: seller1.id,
      title: 'Classic Colonial House in Menteng',
      description: 'Historic colonial-style house in prestigious Menteng area. Maintained original architecture with modern renovations. Large garden, high ceilings, and timeless elegance. Rare opportunity in Jakarta\'s most sought-after neighborhood.',
      propertyType: 'HOUSE',
      listingType: 'SALE',
      price: 15000000000,
      address: 'Jl. Menteng Raya No. 28',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      zipCode: '10340',
      landArea: 500,
      buildingArea: 400,
      bedrooms: 6,
      bathrooms: 5,
      floors: 2,
      carports: 4,
      yearBuilt: 1935,
      certificate: 'SHM',
      furnished: false,
      status: 'AVAILABLE',
    },
    {
      ownerId: seller2.id,
      title: 'Beach Front Villa in Sanur',
      description: 'Direct beach access villa in peaceful Sanur. Wake up to ocean views every morning. Traditional Balinese architecture meets modern comfort. Perfect for vacation rental or permanent residence. Includes staff quarters and lush tropical garden.',
      propertyType: 'VILLA',
      listingType: 'SALE',
      price: 6500000000,
      address: 'Jl. Pantai Sanur No. 88',
      city: 'Denpasar',
      province: 'Bali',
      zipCode: '80227',
      landArea: 400,
      buildingArea: 300,
      bedrooms: 4,
      bathrooms: 4,
      floors: 1,
      carports: 2,
      yearBuilt: 2020,
      certificate: 'SHM',
      furnished: true,
      status: 'AVAILABLE',
    },
  ];

  for (const propertyData of properties) {
    await prisma.property.create({
      data: propertyData,
    });
  }

  console.log('✅ Created properties');
  console.log(`
  📊 Seed Summary:
  - Users created: 3
  - Properties created: ${properties.length}

  🔑 Test Credentials:
  Email: seller1@easyhome.com
  Email: seller2@easyhome.com
  Email: developer@easyhome.com
  Password: password123 (for all)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
