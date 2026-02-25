import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export default apiClient;

// API endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  resendVerification: () => apiClient.post('/auth/resend-verification'),
};

export const propertyAPI = {
  getProperties: (params) => apiClient.get('/properties', { params }),
  getPropertyById: (id) => apiClient.get(`/properties/${id}`),
  createProperty: (data) => apiClient.post('/properties', data),
  updateProperty: (id, data) => apiClient.put(`/properties/${id}`, data),
  deleteProperty: (id) => apiClient.delete(`/properties/${id}`),
  getMyProperties: (params) => apiClient.get('/properties/my/listings', { params }),
  toggleFavorite: (id) => apiClient.post(`/properties/${id}/favorite`),
  getFavorites: (params) => apiClient.get('/properties/my/favorites', { params }),
};

export const imageAPI = {
  uploadImages: (propertyId, formData) =>
    axios.post(`${API_URL}/api/properties/${propertyId}/images`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    }),
  getPropertyImages: (propertyId) => apiClient.get(`/properties/${propertyId}/images`),
  deleteImage: (imageId) => apiClient.delete(`/images/${imageId}`),
  updateImage: (imageId, data) => apiClient.put(`/images/${imageId}`, data),
  reorderImages: (propertyId, imageOrders) =>
    apiClient.put(`/properties/${propertyId}/images/reorder`, { imageOrders }),
};
