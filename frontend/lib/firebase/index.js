/**
 * Firebase Module
 *
 * Central export point for all Firebase functionality
 */

// Configuration
export { app, auth, db, storage, isFirebaseConfigured } from './config';

// Authentication
export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  sendVerificationEmail,
  resetPassword,
  updateUserPassword,
  onAuthStateChange,
  getIdToken,
} from './auth';

// Firestore Database
export {
  createProperty,
  getPropertyById,
  getProperties,
  getPropertiesByUserId,
  updateProperty,
  deleteProperty,
  incrementPropertyViews,
  setUserProfile,
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
  getFavoritePropertyIds,
  getFavoriteProperties,
  isPropertyFavorited,
} from './firestore';

// Storage
export {
  uploadImage,
  uploadPropertyImages,
  deleteImage,
  deleteMultipleImages,
  deletePropertyImages,
  getImageUrl,
  getPropertyImageUrls,
  validateImageFile,
  validateImageFiles,
  generateImagePath,
} from './storage';
