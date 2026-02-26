/**
 * Firebase API Client
 *
 * Provides a Firebase-based implementation that mirrors the REST API structure.
 * This allows for seamless switching between Firebase and traditional backend.
 */

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  sendVerificationEmail,
  resetPassword,
  onAuthStateChange,
} from '../firebase/auth';

import {
  createProperty as fbCreateProperty,
  getPropertyById as fbGetPropertyById,
  getProperties as fbGetProperties,
  getPropertiesByUserId,
  updateProperty as fbUpdateProperty,
  deleteProperty as fbDeleteProperty,
  incrementPropertyViews,
  addToFavorites,
  removeFromFavorites,
  getFavoriteProperties,
  isPropertyFavorited,
} from '../firebase/firestore';

import {
  uploadPropertyImages,
  deletePropertyImages,
  getPropertyImageUrls,
} from '../firebase/storage';

/**
 * Format response to match REST API structure
 * @param {Object} data - Response data
 * @param {string} [message] - Success message
 * @returns {Object} Formatted response
 */
const formatResponse = (data, message = 'Success') => ({
  data,
  message,
  success: true,
});

/**
 * Format error response to match REST API structure
 * @param {Error} error - Error object
 * @returns {Object} Formatted error response
 */
const formatError = (error) => ({
  error: error.message || 'An error occurred',
  success: false,
});

/**
 * Authentication API
 */
export const firebaseAuthAPI = {
  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @returns {Promise<Object>} Response object
   */
  register: async (data) => {
    try {
      const { email, password, fullName } = data;
      const user = await registerUser(email, password, fullName);

      return formatResponse({
        user: {
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          emailVerified: user.emailVerified,
        },
        token: await user.getIdToken?.() || null,
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Login user
   * @param {Object} data - Login credentials
   * @returns {Promise<Object>} Response object
   */
  login: async (data) => {
    try {
      const { email, password } = data;
      const user = await loginUser(email, password);

      return formatResponse({
        user: {
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          emailVerified: user.emailVerified,
        },
        token: user.uid, // Use UID as token identifier
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Response object
   */
  logout: async () => {
    try {
      await logoutUser();
      return formatResponse({}, 'Logged out successfully');
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} Response object
   */
  getProfile: async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      return formatResponse({
        user: {
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        },
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise<Object>} Response object
   */
  updateProfile: async (data) => {
    try {
      const user = await updateUserProfile(data);

      return formatResponse({
        user: {
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        },
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Resend verification email
   * @returns {Promise<Object>} Response object
   */
  resendVerification: async () => {
    try {
      await sendVerificationEmail();
      return formatResponse({}, 'Verification email sent');
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Reset password
   * @param {Object} data - Email data
   * @returns {Promise<Object>} Response object
   */
  resetPassword: async (data) => {
    try {
      const { email } = data;
      await resetPassword(email);
      return formatResponse({}, 'Password reset email sent');
    } catch (error) {
      throw formatError(error);
    }
  },
};

/**
 * Property API
 */
export const firebasePropertyAPI = {
  /**
   * Get all properties with filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response object
   */
  getProperties: async (params = {}) => {
    try {
      const result = await fbGetProperties(params);

      return formatResponse({
        properties: result.properties,
        pagination: {
          hasMore: result.hasMore,
          total: result.properties.length,
        },
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Get property by ID
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Response object
   */
  getPropertyById: async (id) => {
    try {
      const property = await fbGetPropertyById(id);

      if (!property) {
        throw new Error('Property not found');
      }

      // Increment view count asynchronously (don't wait)
      incrementPropertyViews(id).catch(() => {});

      // Images are already in the property document as URL arrays
      const images = property.images || [];

      return formatResponse({
        property: {
          ...property,
          images: Array.isArray(images)
            ? images.map((url, idx) => ({
                id: idx,
                url: typeof url === 'string' ? url : url.url || url,
                order: idx,
                isPrimary: idx === 0,
              }))
            : [],
        },
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Create new property
   * @param {Object} data - Property data
   * @returns {Promise<Object>} Response object
   */
  createProperty: async (data) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const property = await fbCreateProperty(data, user.uid);

      return formatResponse({ property }, 'Property created successfully');
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Update property
   * @param {string} id - Property ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Response object
   */
  updateProperty: async (id, data) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      // Verify ownership
      const property = await fbGetPropertyById(id);
      if (property.userId !== user.uid) {
        throw new Error('Unauthorized');
      }

      await fbUpdateProperty(id, data);
      const updatedProperty = await fbGetPropertyById(id);

      return formatResponse({ property: updatedProperty }, 'Property updated successfully');
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Delete property
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Response object
   */
  deleteProperty: async (id) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      // Verify ownership
      const property = await fbGetPropertyById(id);
      if (property.userId !== user.uid) {
        throw new Error('Unauthorized');
      }

      // Delete property images
      await deletePropertyImages(id);

      // Delete property document
      await fbDeleteProperty(id);

      return formatResponse({}, 'Property deleted successfully');
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Get user's properties
   * @returns {Promise<Object>} Response object
   */
  getMyProperties: async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const properties = await getPropertiesByUserId(user.uid);

      // Images are already in the property documents
      const propertiesWithImages = properties.map((property) => {
        const images = property.images || [];
        return {
          ...property,
          images: Array.isArray(images)
            ? images.map((url, idx) => ({
                id: idx,
                url: typeof url === 'string' ? url : url.url || url,
                order: idx,
                isPrimary: idx === 0,
              }))
            : [],
          _count: {
            favorites: 0, // TODO: Implement favorites count
          },
        };
      });

      return formatResponse({ properties: propertiesWithImages });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Toggle property favorite
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Response object
   */
  toggleFavorite: async (id) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const isFavorited = await isPropertyFavorited(user.uid, id);

      if (isFavorited) {
        await removeFromFavorites(user.uid, id);
        return formatResponse({ isFavorited: false }, 'Removed from favorites');
      } else {
        await addToFavorites(user.uid, id);
        return formatResponse({ isFavorited: true }, 'Added to favorites');
      }
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Get user's favorite properties
   * @returns {Promise<Object>} Response object
   */
  getFavorites: async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const properties = await getFavoriteProperties(user.uid);

      // Images are already in the property documents
      const propertiesWithImages = properties.map((property) => {
        const images = property.images || [];
        return {
          ...property,
          images: Array.isArray(images)
            ? images.map((url, idx) => ({
                id: idx,
                url: typeof url === 'string' ? url : url.url || url,
                order: idx,
                isPrimary: idx === 0,
              }))
            : [],
        };
      });

      return formatResponse({ properties: propertiesWithImages });
    } catch (error) {
      throw formatError(error);
    }
  },
};

/**
 * Image API
 */
export const firebaseImageAPI = {
  /**
   * Upload images for a property
   * @param {string} propertyId - Property ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise<Object>} Response object
   */
  uploadImages: async (propertyId, formData) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      // Verify ownership
      const property = await fbGetPropertyById(propertyId);
      if (property.userId !== user.uid) {
        throw new Error('Unauthorized');
      }

      // Extract files from FormData
      const files = formData.getAll('images');

      if (!files || files.length === 0) {
        throw new Error('No images provided');
      }

      // Upload images
      const uploadedImages = await uploadPropertyImages(files, propertyId);

      return formatResponse(
        {
          images: uploadedImages.map((img, idx) => ({
            id: idx,
            url: img.url,
            order: img.order,
            isPrimary: img.isPrimary,
          })),
        },
        'Images uploaded successfully'
      );
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Get property images
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Response object
   */
  getPropertyImages: async (propertyId) => {
    try {
      // Get property to access its images array
      const property = await fbGetPropertyById(propertyId);
      const images = property?.images || [];

      return formatResponse({
        images: Array.isArray(images)
          ? images.map((url, idx) => ({
              id: idx,
              url: typeof url === 'string' ? url : url.url || url,
              order: idx,
              isPrimary: idx === 0,
            }))
          : [],
      });
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Delete image (placeholder - Firebase uses full property deletion)
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Response object
   */
  deleteImage: async (imageId) => {
    try {
      // TODO: Implement individual image deletion
      throw new Error('Individual image deletion not yet implemented');
    } catch (error) {
      throw formatError(error);
    }
  },
};

export default {
  auth: firebaseAuthAPI,
  property: firebasePropertyAPI,
  image: firebaseImageAPI,
  onAuthStateChange,
};
