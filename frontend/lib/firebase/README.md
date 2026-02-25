# Firebase Integration Guide

This directory contains all Firebase-related functionality for the EasyHome application.

## Overview

The Firebase integration provides a serverless backend alternative to the traditional REST API. It includes:

- **Authentication**: User registration, login, and profile management
- **Firestore Database**: Property listings, user data, and favorites
- **Storage**: Image upload and management

## Architecture

```
lib/firebase/
├── config.js       # Firebase initialization and configuration
├── auth.js         # Authentication services
├── firestore.js    # Database operations (CRUD)
├── storage.js      # File storage and image management
├── index.js        # Central export point
└── README.md       # This file
```

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### 2. Enable Firebase Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" authentication
3. Optionally enable email verification

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode** (recommended) or test mode
4. Choose your location (select closest to your users)

#### Storage
1. Go to Storage
2. Click "Get started"
3. Start in **production mode** (recommended)
4. Choose your location (same as Firestore)

### 3. Configure Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection
    match /properties/{propertyId} {
      // Anyone can read available properties
      allow read: if resource.data.status == 'AVAILABLE';
      // Authenticated users can create properties
      allow create: if request.auth != null;
      // Only owner can update/delete
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }

    // Users collection
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    // Favorites collection
    match /favorites/{userId} {
      // Users can read/write their own favorites
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Properties images
    match /properties/{propertyId}/{allPaths=**} {
      // Anyone can read property images
      allow read: if true;
      // Only authenticated users can upload
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register your app (name: "EasyHome Web")
5. Copy the configuration values

### 5. Set Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Enable Firebase (set to 'true' to use Firebase instead of REST API)
NEXT_PUBLIC_USE_FIREBASE=true
```

## Usage

### Using the Unified API Client

The application automatically uses Firebase when `NEXT_PUBLIC_USE_FIREBASE=true`:

```javascript
import { authAPI, propertyAPI, imageAPI } from '@/lib/api/client';

// Authentication
const response = await authAPI.login({ email, password });

// Properties
const properties = await propertyAPI.getProperties();

// Images
await imageAPI.uploadImages(propertyId, formData);
```

### Direct Firebase Usage

You can also import Firebase functions directly:

```javascript
import { loginUser, getProperties, uploadPropertyImages } from '@/lib/firebase';

// Authentication
const user = await loginUser(email, password);

// Get properties
const result = await getProperties({ city: 'Jakarta' });

// Upload images
const images = await uploadPropertyImages(files, propertyId);
```

## Data Models

### Property Document
```typescript
{
  id: string;
  title: string;
  description: string;
  propertyType: 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'VILLA';
  listingType: 'SALE' | 'RENT';
  price: number;
  pricePerMonth?: number;
  address: string;
  city: string;
  province: string;
  zipCode?: string;
  landArea?: number;
  buildingArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  carports?: number;
  furnished: boolean;
  certificate?: string;
  yearBuilt?: number;
  status: 'AVAILABLE' | 'SOLD' | 'RENTED';
  userId: string;
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### User Document
```typescript
{
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  photoURL?: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Favorites Document
```typescript
{
  id: string; // Same as userId
  propertyIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Features

### Authentication
- ✅ Email/password registration
- ✅ Email verification
- ✅ Login/logout
- ✅ Password reset
- ✅ Profile management
- ✅ Auth state persistence

### Properties
- ✅ Create property listings
- ✅ Read properties with filters
- ✅ Update properties
- ✅ Delete properties
- ✅ View count tracking
- ✅ Owner verification

### Favorites
- ✅ Add to favorites
- ✅ Remove from favorites
- ✅ Get favorite properties
- ✅ Check favorite status

### Images
- ✅ Upload multiple images
- ✅ Delete property images
- ✅ Get image URLs
- ✅ File validation (type, size)
- ✅ Automatic optimization

## Migration from REST API

The Firebase implementation maintains the same API interface as the REST backend, making migration seamless:

1. Set up Firebase project and services
2. Configure environment variables
3. Set `NEXT_PUBLIC_USE_FIREBASE=true`
4. Application automatically switches to Firebase

No code changes needed in components!

## Performance Considerations

### Firestore
- Use indexes for complex queries
- Implement pagination for large datasets
- Cache frequently accessed data
- Use real-time listeners sparingly

### Storage
- Compress images before upload
- Use appropriate image formats (WebP recommended)
- Implement lazy loading
- Use Firebase CDN for fast delivery

### Authentication
- Token caching in localStorage
- Automatic token refresh
- Session persistence

## Cost Optimization

Firebase offers generous free tiers:

- **Firestore**: 50,000 reads/day
- **Storage**: 5GB storage, 1GB/day transfer
- **Authentication**: Unlimited users

Tips to stay within free tier:
1. Implement efficient queries
2. Use pagination
3. Optimize images before upload
4. Cache data in localStorage
5. Use security rules to prevent abuse

## Troubleshooting

### Firebase not initializing
- Check environment variables are set correctly
- Ensure variables start with `NEXT_PUBLIC_`
- Verify Firebase project is active

### Authentication errors
- Check Email/Password auth is enabled
- Verify email format
- Check password requirements (min 6 chars)

### Permission denied errors
- Review Firestore security rules
- Check user is authenticated
- Verify ownership for update/delete operations

### Image upload failures
- Check file size (max 5MB)
- Verify file type is image
- Check Storage rules allow writes

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

For application issues:
- Check application logs
- Review security rules
- Test with Firebase Emulator Suite
