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

  // Ensure we have a proper number, not a string
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) return 'Rp 0';

  if (compact) {
    // Use natural Indonesian notation (how Indonesians actually talk about prices)
    if (numAmount >= 1000000000) {
      // Billions (Miliar) - "Rp 2.5 M" not "Rp 2500 Jt"
      const miliar = numAmount / 1000000000;
      if (miliar >= 100) {
        // 100+ billion: "Rp 150 M"
        return `Rp ${Math.round(miliar)} M`;
      } else if (miliar >= 10) {
        // 10-99 billion: "Rp 15 M" (no decimals)
        return `Rp ${Math.round(miliar)} M`;
      } else {
        // 1-9 billion: "Rp 2.5 M" (1 decimal)
        return `Rp ${miliar.toFixed(1)} M`;
      }
    } else if (numAmount >= 1000000) {
      // Millions (Juta) - only for under 1 billion
      const juta = numAmount / 1000000;
      if (juta >= 100) {
        // 100+ million: "Rp 850 Jt"
        return `Rp ${Math.round(juta)} Jt`;
      } else if (juta >= 10) {
        // 10-99 million: "Rp 25 Jt" (no decimals)
        return `Rp ${Math.round(juta)} Jt`;
      } else {
        // 1-9 million: "Rp 2.5 Jt" (1 decimal)
        return `Rp ${juta.toFixed(1)} Jt`;
      }
    } else if (numAmount >= 10000) {
      // Thousands (Ribu) - for prices under 1 million
      return `Rp ${Math.round(numAmount / 1000)} Rb`;
    }
    // Under 10k: show full number
    return `Rp ${Math.round(numAmount).toLocaleString('id-ID')}`;
  }

  // Full format with Indonesian locale (Rp 2.500.000)
  return `Rp ${Math.round(numAmount).toLocaleString('id-ID')}`;
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
