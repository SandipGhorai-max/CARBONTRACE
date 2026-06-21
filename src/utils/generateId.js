/**
 * Generates a unique identifier.
 * Uses crypto.randomUUID if available, otherwise falls back to a math random string.
 * @returns {string} Unique UUID or random string.
 */
export const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);
};
