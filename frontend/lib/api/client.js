/**
 * API Client
 *
 * Unified API client that supports both REST API and Firebase backends.
 * Switches between backends based on configuration.
 */

import axios from 'axios';
import { isFirebaseConfigured } from '../firebase/config';
import {
  firebaseAuthAPI,
  firebasePropertyAPI,
  firebaseImageAPI,
} from './firebase-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Feature flag: Use Firebase if configured, otherwise use REST API
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true' && isFirebaseConfigured();

console.log(`API Client Mode: ${USE_FIREBASE ? 'Firebase' : 'REST API'}`);

/**
 * REST API Client Configuration
 */
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API
 */
export const authAPI = USE_FIREBASE
  ? firebaseAuthAPI
  : {
      register: (data) => apiClient.post('/auth/register', data),
      login: (data) => apiClient.post('/auth/login', data),
      verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
      getProfile: () => apiClient.get('/auth/profile'),
      updateProfile: (data) => apiClient.put('/auth/profile', data),
      resendVerification: () => apiClient.post('/auth/resend-verification'),
    };

/**
 * Property API
 */
export const propertyAPI = USE_FIREBASE
  ? firebasePropertyAPI
  : {
      getProperties: (params) => apiClient.get('/properties', { params }),
      getPropertyById: (id) => apiClient.get(`/properties/${id}`),
      createProperty: (data) => apiClient.post('/properties', data),
      updateProperty: (id, data) => apiClient.put(`/properties/${id}`, data),
      deleteProperty: (id) => apiClient.delete(`/properties/${id}`),
      getMyProperties: (params) => apiClient.get('/properties/my/listings', { params }),
      toggleFavorite: (id) => apiClient.post(`/properties/${id}/favorite`),
      getFavorites: (params) => apiClient.get('/properties/my/favorites', { params }),
    };

/**
 * Image API
 */
export const imageAPI = USE_FIREBASE
  ? {
      uploadImages: (propertyId, formData) =>
        firebaseImageAPI.uploadImages(propertyId, formData),
      getPropertyImages: (propertyId) =>
        firebaseImageAPI.getPropertyImages(propertyId),
      deleteImage: (imageId) => firebaseImageAPI.deleteImage(imageId),
      updateImage: (imageId, data) => {
        // Firebase implementation
        throw new Error('Update image not implemented for Firebase');
      },
      reorderImages: (propertyId, imageOrders) => {
        // Firebase implementation
        throw new Error('Reorder images not implemented for Firebase');
      },
    }
  : {
      uploadImages: (propertyId, formData) =>
        axios.post(`${API_URL}/api/properties/${propertyId}/images`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
      getPropertyImages: (propertyId) => apiClient.get(`/properties/${propertyId}/images`),
      deleteImage: (imageId) => apiClient.delete(`/images/${imageId}`),
      updateImage: (imageId, data) => apiClient.put(`/images/${imageId}`, data),
      reorderImages: (propertyId, imageOrders) =>
        apiClient.put(`/properties/${propertyId}/images/reorder`, { imageOrders }),
    };

/**
 * Export configuration info
 */
export const apiConfig = {
  isFirebase: USE_FIREBASE,
  apiUrl: API_URL,
};

/**
 * Helper function to handle API responses consistently
 * Works with both Firebase and REST API responses
 */
export const handleApiResponse = (response) => {
  // Firebase responses already have the correct format
  if (USE_FIREBASE) {
    return response;
  }

  // REST API responses need to be normalized
  return response;
};

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error) => {
  if (USE_FIREBASE) {
    // Firebase errors
    return {
      message: error.error || 'An error occurred',
      success: false,
    };
  }

  // REST API errors
  return {
    message: error.response?.data?.error || error.message || 'An error occurred',
    success: false,
  };
};

export default apiClient;
