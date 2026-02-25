import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFavorite,
  getFavorites,
} from '../controllers/propertyController.js';
import { authenticateToken, requireVerified } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authenticateToken, requireVerified, createProperty);
router.put('/:id', authenticateToken, requireVerified, updateProperty);
router.delete('/:id', authenticateToken, requireVerified, deleteProperty);
router.get('/my/listings', authenticateToken, getMyProperties);

// Favorites
router.post('/:id/favorite', authenticateToken, toggleFavorite);
router.get('/my/favorites', authenticateToken, getFavorites);

export default router;
