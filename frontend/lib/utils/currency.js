/**
 * Indonesian Rupiah Currency Formatter
 * Formats numbers to Indonesian Rupiah (Rp) with proper localization
 */

/**
 * Format number as Indonesian Rupiah
 * @param {number} amount - Amount in IDR
 * @param {boolean} compact - Use compact notation (e.g., "2.5 M" instead of "2,500,000")
 * @returns {string} Formatted currency string
 */
export function formatRupiah(amount, compact = false) {
  if (!amount || isNaN(amount)) return 'Rp 0';

  const numAmount = Number(amount);

  if (compact) {
    // Use compact notation for large numbers
    if (numAmount >= 1000000000) {
      // Billions (Miliar)
      return `Rp ${(numAmount / 1000000000).toFixed(1)} M`;
    } else if (numAmount >= 1000000) {
      // Millions (Juta)
      return `Rp ${(numAmount / 1000000).toFixed(1)} Jt`;
    } else if (numAmount >= 1000) {
      // Thousands (Ribu)
      return `Rp ${(numAmount / 1000).toFixed(0)} Rb`;
    }
    return `Rp ${numAmount.toLocaleString('id-ID')}`;
  }

  // Full format with Indonesian locale
  return `Rp ${numAmount.toLocaleString('id-ID')}`;
}

/**
 * Format number as compact Indonesian Rupiah (for property cards)
 * @param {number} amount - Amount in IDR
 * @returns {string} Compact formatted currency
 */
export function formatCompactRupiah(amount) {
  return formatRupiah(amount, true);
}

/**
 * Parse Rupiah string back to number
 * @param {string} rupiahString - Formatted rupiah string
 * @returns {number} Numeric value
 */
export function parseRupiah(rupiahString) {
  if (!rupiahString) return 0;
  // Remove "Rp", spaces, dots, and parse
  return Number(rupiahString.replace(/[Rp\s.]/g, '').replace(',', '.'));
}

/**
 * Format price range
 * @param {number} minPrice
 * @param {number} maxPrice
 * @returns {string} Formatted price range
 */
export function formatPriceRange(minPrice, maxPrice) {
  if (!minPrice && !maxPrice) return 'Any price';
  if (!minPrice) return `Up to ${formatRupiah(maxPrice, true)}`;
  if (!maxPrice) return `From ${formatRupiah(minPrice, true)}`;
  return `${formatRupiah(minPrice, true)} - ${formatRupiah(maxPrice, true)}`;
}

// Export default for convenience
export default formatRupiah;
