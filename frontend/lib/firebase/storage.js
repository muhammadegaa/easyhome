/**
 * Simple Storage Service - URL-based (NO FILE UPLOADS)
 *
 * For MVP: No file upload functionality to keep it 100% FREE
 * - Firestore can only store URLs (strings), not actual files
 * - Users can paste external image URLs
 * - Or use placeholder/demo images
 * - This keeps the app completely free with no storage costs
 */

/**
 * Validate image URL
 * @param {string} url - Image URL to validate
 * @returns {Object} Validation result
 */
export const validateImageUrl = (url) => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    // Check if it's a valid HTTP/HTTPS URL
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    // Check if it looks like an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );

    // Also accept common image hosting domains even without extension
    const imageDomains = ['imgur.com', 'unsplash.com', 'pexels.com', 'cloudinary.com'];
    const isImageDomain = imageDomains.some(domain =>
      urlObj.hostname.includes(domain)
    );

    if (!hasImageExtension && !isImageDomain) {
      return {
        isValid: true, // Allow it but warn
        warning: 'URL might not be a valid image. Make sure it links to an image file.'
      };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate multiple image URLs
 * @param {Array<string>} urls - Array of image URLs
 * @param {number} maxImages - Maximum number of images
 * @returns {Object} Validation result
 */
export const validateImageUrls = (urls, maxImages = 20) => {
  if (!urls || urls.length === 0) {
    return { isValid: false, error: 'At least one image URL is required' };
  }

  if (urls.length > maxImages) {
    return { isValid: false, error: `Maximum ${maxImages} images allowed` };
  }

  // Validate each URL
  for (let i = 0; i < urls.length; i++) {
    const validation = validateImageUrl(urls[i]);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `Image ${i + 1}: ${validation.error}`
      };
    }
  }

  return { isValid: true };
};

/**
 * Format image URL for storage
 * @param {string} url - Raw image URL
 * @returns {string} Formatted URL
 */
export const formatImageUrl = (url) => {
  if (!url) return '';
  return url.trim();
};

/**
 * Get placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width = 800, height = 600) => {
  return `https://placehold.co/${width}x${height}/10b981/ffffff?text=Property+Image`;
};

/**
 * Dummy functions for API compatibility
 * These don't actually upload files - they're just here so existing code doesn't break
 */

export const uploadImage = async (file, path, onProgress = null) => {
  throw new Error('File uploads are disabled. Please use external image URLs instead.');
};

export const uploadPropertyImages = async (files, propertyId, onProgress = null) => {
  throw new Error('File uploads are disabled. Please use external image URLs instead.');
};

export const deleteImage = async (path) => {
  // No-op: URLs don't need deletion
  return true;
};

export const deleteMultipleImages = async (paths) => {
  // No-op: URLs don't need deletion
  return true;
};

export const deletePropertyImages = async (propertyId) => {
  // No-op: URLs don't need deletion
  return true;
};

export const getImageUrl = async (url) => {
  // If it's already a URL, just return it
  return url;
};

export default {
  validateImageUrl,
  validateImageUrls,
  formatImageUrl,
  getPlaceholderImage,
  uploadImage,
  uploadPropertyImages,
  deleteImage,
  deleteMultipleImages,
  deletePropertyImages,
  getImageUrl,
};
