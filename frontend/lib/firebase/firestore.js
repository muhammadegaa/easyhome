/**
 * Firebase Firestore Service
 *
 * Handles all database operations including:
 * - Property CRUD operations
 * - User management
 * - Favorites system
 * - Query and filtering
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const COLLECTIONS = {
  PROPERTIES: 'properties',
  USERS: 'users',
  FAVORITES: 'favorites',
};

/**
 * Property Operations
 */

/**
 * Create a new property listing
 *
 * @param {Object} propertyData - Property data
 * @param {string} userId - Owner's user ID
 * @returns {Promise<Object>} Created property with ID
 * @throws {Error} If creation fails
 */
export const createProperty = async (propertyData, userId) => {
  try {
    const propertyRef = collection(db, COLLECTIONS.PROPERTIES);

    const newProperty = {
      ...propertyData,
      userId,
      status: 'AVAILABLE',
      viewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(propertyRef, newProperty);

    return {
      id: docRef.id,
      ...newProperty,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property. Please try again.');
  }
};

/**
 * Get property by ID
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object|null>} Property data or null if not found
 * @throws {Error} If retrieval fails
 */
export const getPropertyById = async (propertyId) => {
  try {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
    const propertySnap = await getDoc(propertyRef);

    if (!propertySnap.exists()) {
      return null;
    }

    return {
      id: propertySnap.id,
      ...propertySnap.data(),
    };
  } catch (error) {
    console.error('Error getting property:', error);
    throw new Error('Failed to load property. Please try again.');
  }
};

/**
 * Get properties with filters and pagination
 *
 * @param {Object} filters - Filter options
 * @param {string} [filters.listingType] - SALE or RENT
 * @param {string} [filters.propertyType] - Property type
 * @param {string} [filters.city] - City name
 * @param {string} [filters.province] - Province name
 * @param {number} [filters.minPrice] - Minimum price
 * @param {number} [filters.maxPrice] - Maximum price
 * @param {number} [filters.bedrooms] - Number of bedrooms
 * @param {number} [filters.bathrooms] - Number of bathrooms
 * @param {string} [filters.sortBy] - Sort field (default: createdAt)
 * @param {string} [filters.sortOrder] - Sort order (asc/desc, default: desc)
 * @param {number} [filters.limit] - Number of results (default: 20)
 * @param {Object} [filters.lastDoc] - Last document for pagination
 * @returns {Promise<Object>} Object with properties array and pagination info
 * @throws {Error} If query fails
 */
export const getProperties = async (filters = {}) => {
  try {
    const {
      listingType,
      propertyType,
      city,
      province,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit: limitCount = 20,
      lastDoc,
    } = filters;

    let q = collection(db, COLLECTIONS.PROPERTIES);
    const constraints = [];

    // Apply filters
    if (listingType) {
      constraints.push(where('listingType', '==', listingType));
    }
    if (propertyType) {
      constraints.push(where('propertyType', '==', propertyType));
    }
    if (city) {
      constraints.push(where('city', '==', city));
    }
    if (province) {
      constraints.push(where('province', '==', province));
    }
    if (minPrice !== undefined) {
      constraints.push(where('price', '>=', minPrice));
    }
    if (maxPrice !== undefined) {
      constraints.push(where('price', '<=', maxPrice));
    }
    if (bedrooms !== undefined) {
      constraints.push(where('bedrooms', '==', bedrooms));
    }
    if (bathrooms !== undefined) {
      constraints.push(where('bathrooms', '==', bathrooms));
    }

    // Only show available properties by default
    constraints.push(where('status', '==', 'AVAILABLE'));

    // Add sorting
    constraints.push(orderBy(sortBy, sortOrder));

    // Add limit
    constraints.push(limit(limitCount));

    // Add pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);

    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      properties,
      lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error('Error getting properties:', error);
    throw new Error('Failed to load properties. Please try again.');
  }
};

/**
 * Get properties by user ID
 *
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user's properties
 * @throws {Error} If query fails
 */
export const getPropertiesByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return properties;
  } catch (error) {
    console.error('Error getting user properties:', error);
    throw new Error('Failed to load your properties. Please try again.');
  }
};

/**
 * Update property
 *
 * @param {string} propertyId - Property ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 * @throws {Error} If update fails
 */
export const updateProperty = async (propertyId, updates) => {
  try {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);

    await updateDoc(propertyRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property. Please try again.');
  }
};

/**
 * Delete property
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteProperty = async (propertyId) => {
  try {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
    await deleteDoc(propertyRef);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property. Please try again.');
  }
};

/**
 * Increment property view count
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 */
export const incrementPropertyViews = async (propertyId) => {
  try {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
    await updateDoc(propertyRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw error for view count failures
  }
};

/**
 * User Operations
 */

/**
 * Create or update user profile
 *
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<void>}
 * @throws {Error} If operation fails
 */
export const setUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        id: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

/**
 * Get user profile
 *
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Favorites Operations
 */

/**
 * Add property to favorites
 *
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 * @throws {Error} If operation fails
 */
export const addToFavorites = async (userId, propertyId) => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, userId);

    await updateDoc(favoriteRef, {
      propertyIds: arrayUnion(propertyId),
      updatedAt: serverTimestamp(),
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, COLLECTIONS.FAVORITES), {
        id: userId,
        propertyIds: [propertyId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add to favorites. Please try again.');
  }
};

/**
 * Remove property from favorites
 *
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 * @throws {Error} If operation fails
 */
export const removeFromFavorites = async (userId, propertyId) => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, userId);

    await updateDoc(favoriteRef, {
      propertyIds: arrayRemove(propertyId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites. Please try again.');
  }
};

/**
 * Get user's favorite property IDs
 *
 * @param {string} userId - User ID
 * @returns {Promise<Array<string>>} Array of property IDs
 */
export const getFavoritePropertyIds = async (userId) => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, userId);
    const favoriteSnap = await getDoc(favoriteRef);

    if (!favoriteSnap.exists()) {
      return [];
    }

    return favoriteSnap.data().propertyIds || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Get user's favorite properties with details
 *
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite properties
 */
export const getFavoriteProperties = async (userId) => {
  try {
    const favoriteIds = await getFavoritePropertyIds(userId);

    if (favoriteIds.length === 0) {
      return [];
    }

    // Fetch property details for each favorite
    const propertyPromises = favoriteIds.map((id) => getPropertyById(id));
    const properties = await Promise.all(propertyPromises);

    // Filter out null values (deleted properties)
    return properties.filter((property) => property !== null);
  } catch (error) {
    console.error('Error getting favorite properties:', error);
    return [];
  }
};

/**
 * Check if property is in user's favorites
 *
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<boolean>} True if property is favorited
 */
export const isPropertyFavorited = async (userId, propertyId) => {
  try {
    const favoriteIds = await getFavoritePropertyIds(userId);
    return favoriteIds.includes(propertyId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export default {
  // Property operations
  createProperty,
  getPropertyById,
  getProperties,
  getPropertiesByUserId,
  updateProperty,
  deleteProperty,
  incrementPropertyViews,

  // User operations
  setUserProfile,
  getUserProfile,

  // Favorites operations
  addToFavorites,
  removeFromFavorites,
  getFavoritePropertyIds,
  getFavoriteProperties,
  isPropertyFavorited,
};
