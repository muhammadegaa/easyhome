import express from 'express';
import {
  uploadPropertyImages,
  getPropertyImages,
  deletePropertyImage,
  reorderPropertyImages,
  updatePropertyImage,
} from '../controllers/imageController.js';
import { authenticateToken, requireVerified } from '../middleware/auth.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Upload images to property (protected)
router.post(
  '/properties/:propertyId/images',
  authenticateToken,
  requireVerified,
  uploadMultiple,
  handleUploadError,
  uploadPropertyImages
);

// Get property images (public)
router.get('/properties/:propertyId/images', getPropertyImages);

// Delete image (protected)
router.delete('/images/:imageId', authenticateToken, requireVerified, deletePropertyImage);

// Reorder images (protected)
router.put(
  '/properties/:propertyId/images/reorder',
  authenticateToken,
  requireVerified,
  reorderPropertyImages
);

// Update image details (protected)
router.put('/images/:imageId', authenticateToken, requireVerified, updatePropertyImage);

export default router;
