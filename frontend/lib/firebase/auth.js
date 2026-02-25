/**
 * Firebase Authentication Service
 *
 * Handles user authentication operations including:
 * - Registration with email/password
 * - Login/Logout
 * - Profile management
 * - Password reset
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Register a new user with email and password
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @returns {Promise<Object>} User credential object
 * @throws {Error} If registration fails
 */
export const registerUser = async (email, password, fullName) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      emailVerified: userCredential.user.emailVerified,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw handleAuthError(error);
  }
};

/**
 * Login user with email and password
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User credential object
 * @throws {Error} If login fails
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      emailVerified: userCredential.user.emailVerified,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw handleAuthError(error);
  }
};

/**
 * Logout current user
 *
 * @returns {Promise<void>}
 * @throws {Error} If logout fails
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Get current authenticated user
 *
 * @returns {Object|null} Current user object or null if not authenticated
 */
export const getCurrentUser = () => {
  const user = auth.currentUser;

  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
};

/**
 * Update user profile information
 *
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.displayName] - User's display name
 * @param {string} [profileData.photoURL] - URL to user's photo
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If update fails
 */
export const updateUserProfile = async (profileData) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is currently logged in');
    }

    await updateProfile(user, profileData);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

/**
 * Send email verification to current user
 *
 * @returns {Promise<void>}
 * @throws {Error} If sending verification fails
 */
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is currently logged in');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

/**
 * Send password reset email
 *
 * @param {string} email - User's email address
 * @returns {Promise<void>}
 * @throws {Error} If sending reset email fails
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw handleAuthError(error);
  }
};

/**
 * Update user password
 *
 * @param {string} currentPassword - Current password for verification
 * @param {string} newPassword - New password to set
 * @returns {Promise<void>}
 * @throws {Error} If password update fails
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error('No user is currently logged in');
    }

    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw handleAuthError(error);
  }
};

/**
 * Listen to authentication state changes
 *
 * @param {Function} callback - Callback function called when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get Firebase ID token for API authentication
 *
 * @param {boolean} forceRefresh - Force token refresh
 * @returns {Promise<string|null>} ID token or null if not authenticated
 */
export const getIdToken = async (forceRefresh = false) => {
  try {
    const user = auth.currentUser;

    if (!user) return null;

    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Handle Firebase authentication errors and return user-friendly messages
 *
 * @param {Error} error - Firebase error object
 * @returns {Error} Error with user-friendly message
 */
const handleAuthError = (error) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please logout and login again to perform this action.',
  };

  const message = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
  return new Error(message);
};

export default {
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
};
