/**
 * Formats a number to a specified number of decimal places safely.
 * Guards against null, undefined, NaN, Infinity, and non-numeric strings.
 * @param {*} value
 * @param {number} decimals
 * @returns {string}
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00';
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toFixed(decimals);
};

/**
 * Converts an activities array to a well-formed CSV string.
 * Handles missing fields, empty arrays, and non-array inputs gracefully.
 * @param {Array} activities
 * @returns {string}
 */
export const generateCSV = (activities) => {
  const headers = ['id', 'date', 'category', 'type', 'amount', 'co2'];
  const headerRow = headers.join(',');

  if (!Array.isArray(activities) || activities.length === 0) {
    return headerRow + '\n';
  }

  const rows = activities.map((act) => [
    act.id || '',
    act.date ? new Date(act.date).toISOString().split('T')[0] : '',
    act.category || '',
    act.type || '',
    act.amount != null ? act.amount : 0,
    act.co2 != null ? act.co2 : 0,
  ].join(','));

  return [headerRow, ...rows].join('\n');
};

/**
 * Converts an activities array to a JSON string.
 * @param {Array} activities
 * @returns {string}
 */
export const generateJSON = (activities) => {
  return JSON.stringify(activities || [], null, 2);
};
