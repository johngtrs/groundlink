/**
 * Convert a 2-letter country ISO code to its corresponding flag emoji.
 *
 * @param {string} countryCode - The ISO 3166-1 alpha-2 country code (e.g. "FR", "US")
 * @returns {string} - The flag emoji (e.g. 🇫🇷, 🇺🇸)
 */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}
