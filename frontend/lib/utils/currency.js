/**
 * Indonesian Rupiah Currency Formatter
 * Formats numbers to Indonesian Rupiah (Rp) with proper localization
 */

/**
 * Format number as Indonesian Rupiah (natural, empathetic formatting)
 * @param {number} amount - Amount in IDR
 * @param {boolean} compact - Use compact notation (e.g., "Rp 2.5 M" for Miliar)
 * @returns {string} Formatted currency string
 */
export function formatRupiah(amount, compact = false) {
  if (!amount || isNaN(amount)) return 'Rp 0';

  const numAmount = Number(amount);

  if (compact) {
    // Use natural Indonesian notation
    if (numAmount >= 1000000000) {
      // Billions (Miliar) - Indonesians say "2.5 Miliar" not "2500 Juta"
      const miliar = numAmount / 1000000000;
      if (miliar >= 10) {
        return `Rp ${Math.round(miliar)} M`; // "Rp 15 M" for 15+ billion
      }
      return `Rp ${miliar.toFixed(1)} M`; // "Rp 2.5 M" for under 10 billion
    } else if (numAmount >= 1000000) {
      // Millions (Juta) - only use for under 1 billion
      const juta = numAmount / 1000000;
      if (juta >= 100) {
        return `Rp ${Math.round(juta)} Jt`; // "Rp 850 Jt"
      }
      return `Rp ${juta.toFixed(juta >= 10 ? 0 : 1)} Jt`; // "Rp 2.5 Jt" or "Rp 25 Jt"
    } else if (numAmount >= 10000) {
      // Thousands (Ribu) - for prices under 1 million
      return `Rp ${Math.round(numAmount / 1000)} Rb`;
    }
    return `Rp ${numAmount.toLocaleString('id-ID')}`;
  }

  // Full format with Indonesian locale (Rp 2.500.000)
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
