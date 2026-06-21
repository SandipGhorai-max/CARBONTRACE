/**
 * Sanitizes input text to prevent XSS attacks.
 * @param {string} text Raw input string.
 * @returns {string} Sanitized string.
 */
export const sanitizeString = (text) => {
  if (typeof text !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return text.replace(reg, (match) => (map[match]));
};

/**
 * Validates and clamps a number within a specified range.
 * @param {number} value The number to validate.
 * @param {number} min Minimum allowed value.
 * @param {number} max Maximum allowed value.
 * @returns {number} The clamped number, or NaN if invalid.
 */
export const sanitizeNumber = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return NaN;
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

/**
 * Sanitizes an entire activity entry before saving.
 * @param {Object} entry The raw activity entry.
 * @returns {Object} Sanitized entry.
 */
export const sanitizeEntry = (entry) => {
  if (!entry) return null;
  return {
    ...entry,
    id: sanitizeString(entry.id),
    date: sanitizeString(entry.date),
    category: sanitizeString(entry.category),
    type: sanitizeString(entry.type),
    amount: sanitizeNumber(entry.amount, -Infinity, Infinity),
    co2: sanitizeNumber(entry.co2, -Infinity, Infinity),
  };
};
