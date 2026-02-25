// Environment utilities
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || '';
};

export const getImageUrl = (path) => {
  if (!path) return '';
  // If path is already a full URL (Firebase Storage URL), return as-is
  if (path.startsWith('http')) return path;
  // Otherwise, prepend API URL for local/backend images
  const apiUrl = getApiUrl();
  return `${apiUrl}${path}`;
};
