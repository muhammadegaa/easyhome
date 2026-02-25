/**
 * Firebase Storage Service
 *
 * Handles file upload and management operations including:
 * - Image upload to Firebase Storage
 * - Image deletion
 * - Get image URLs
 * - Multiple image uploads
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a single image to Firebase Storage
 *
 * @param {File} file - Image file to upload
 * @param {string} path - Storage path (e.g., 'properties/propertyId/image.jpg')
 * @param {Function} [onProgress] - Optional progress callback (percentage)
 * @returns {Promise<Object>} Object with url and path
 * @throws {Error} If upload fails
 */
export const uploadImage = async (file, path, onProgress = null) => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Max file size: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    const storageRef = ref(storage, path);

    // Use resumable upload if progress callback is provided
    if (onProgress) {
      return await uploadWithProgress(file, storageRef, onProgress);
    }

    // Simple upload
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path: snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      contentType: file.type,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Upload image with progress tracking
 *
 * @param {File} file - Image file to upload
 * @param {Reference} storageRef - Firebase storage reference
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Object with url and path
 */
const uploadWithProgress = (file, storageRef, onProgress) => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        reject(new Error('Failed to upload image. Please try again.'));
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            path: uploadTask.snapshot.ref.fullPath,
            name: file.name,
            size: file.size,
            contentType: file.type,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Upload multiple images for a property
 *
 * @param {Array<File>} files - Array of image files
 * @param {string} propertyId - Property ID
 * @param {Function} [onProgress] - Progress callback for each file
 * @returns {Promise<Array<Object>>} Array of uploaded image objects
 * @throws {Error} If any upload fails
 */
export const uploadPropertyImages = async (files, propertyId, onProgress = null) => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    if (files.length > 20) {
      throw new Error('Maximum 20 images allowed per property');
    }

    const uploadPromises = files.map(async (file, index) => {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${index}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const path = `properties/${propertyId}/${fileName}`;

      // Upload with progress tracking for each file
      const progressCallback = onProgress
        ? (progress) => onProgress(index, progress)
        : null;

      return await uploadImage(file, path, progressCallback);
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages.map((image, index) => ({
      ...image,
      order: index,
      isPrimary: index === 0, // First image is primary
    }));
  } catch (error) {
    console.error('Error uploading property images:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 *
 * @param {string} path - Storage path of the image
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteImage = async (path) => {
  try {
    if (!path) {
      throw new Error('Image path is required');
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image. Please try again.');
  }
};

/**
 * Delete multiple images from Firebase Storage
 *
 * @param {Array<string>} paths - Array of storage paths
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (paths) => {
  try {
    if (!paths || paths.length === 0) {
      return;
    }

    const deletePromises = paths.map((path) => deleteImage(path));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    // Don't throw error, as some images might have been deleted
  }
};

/**
 * Delete all images for a property
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 */
export const deletePropertyImages = async (propertyId) => {
  try {
    const propertyFolderRef = ref(storage, `properties/${propertyId}`);

    // List all files in the property folder
    const listResult = await listAll(propertyFolderRef);

    // Delete all files
    const deletePromises = listResult.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting property images:', error);
    // Don't throw error, as folder might not exist
  }
};

/**
 * Get download URL for an image
 *
 * @param {string} path - Storage path of the image
 * @returns {Promise<string>} Download URL
 * @throws {Error} If getting URL fails
 */
export const getImageUrl = async (path) => {
  try {
    if (!path) {
      throw new Error('Image path is required');
    }

    // If path is already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }

    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw new Error('Failed to get image URL. Please try again.');
  }
};

/**
 * Get all image URLs for a property
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array<Object>>} Array of image objects with URLs
 */
export const getPropertyImageUrls = async (propertyId) => {
  try {
    const propertyFolderRef = ref(storage, `properties/${propertyId}`);

    // List all files in the property folder
    const listResult = await listAll(propertyFolderRef);

    // Get download URLs for all images
    const urlPromises = listResult.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        url,
        path: itemRef.fullPath,
        name: itemRef.name,
      };
    });

    return await Promise.all(urlPromises);
  } catch (error) {
    console.error('Error getting property image URLs:', error);
    return [];
  }
};

/**
 * Validate image file
 *
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }

  // Check file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG, GIF, and WEBP images are allowed',
    };
  }

  return { isValid: true };
};

/**
 * Validate multiple image files
 *
 * @param {Array<File>} files - Files to validate
 * @param {number} [maxFiles=20] - Maximum number of files allowed
 * @returns {Object} Validation result
 */
export const validateImageFiles = (files, maxFiles = 20) => {
  if (!files || files.length === 0) {
    return { isValid: false, error: 'No files provided' };
  }

  if (files.length > maxFiles) {
    return { isValid: false, error: `Maximum ${maxFiles} images allowed` };
  }

  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const validation = validateImageFile(files[i]);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `File ${i + 1} (${files[i].name}): ${validation.error}`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Generate optimized image path with timestamp
 *
 * @param {string} propertyId - Property ID
 * @param {string} fileName - Original file name
 * @param {number} [index=0] - Image index
 * @returns {string} Optimized storage path
 */
export const generateImagePath = (propertyId, fileName, index = 0) => {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `properties/${propertyId}/${timestamp}_${index}_${sanitizedName}`;
};

export default {
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
};
