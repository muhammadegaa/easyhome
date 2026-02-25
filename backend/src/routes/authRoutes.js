import express from 'express';
import {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
  resendVerification,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/resend-verification', authenticateToken, resendVerification);

export default router;
