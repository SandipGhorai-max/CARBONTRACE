import { CARBON_FACTORS } from '../constants/carbonFactors';

/**
 * Calculates total CO2 in kg for a given activity type and amount.
 * Pure function with no side effects.
 * @param {string} category
 * @param {string} type
 * @param {number} amount
 * @returns {number} CO2 in kg, or 0 for invalid inputs
 */
export const calculateActivityCO2 = (category, type, amount) => {
  if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) return 0;
  const factor = CARBON_FACTORS[category]?.[type]?.value;
  if (factor === undefined || factor === null) return 0;
  return factor * amount;
};

/**
 * Summarises total CO2 by category from an array of activities.
 * Pure function.
 * @param {Array} activities
 * @returns {Object} map of category to total kg CO2
 */
export const summarizeByCategory = (activities = []) => {
  if (!Array.isArray(activities)) return {};
  return activities.reduce((acc, act) => {
    acc[act.category] = (acc[act.category] || 0) + (act.co2 || 0);
    return acc;
  }, {});
};

/**
 * Finds the highest impact category from a summary object.
 * Pure function. Returns null on ties deterministically (first entry in insertion order).
 * @param {Object} summary map of category to total kg CO2
 * @returns {string|null} category name or null if empty
 */
export const getHighestImpactCategory = (summary = {}) => {
  if (!summary || typeof summary !== 'object') return null;
  const entries = Object.entries(summary);
  if (entries.length === 0) return null;
  return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];
};

/**
 * Calculates annual CO2 projection in metric tonnes based on logged activities.
 * @param {number} totalKg total CO2 logged in kg
 * @param {number} daysLogged number of unique days logged
 * @returns {number} projected annual CO2 in metric tonnes, or 0 for invalid inputs
 */
export const calculateAnnualProjection = (totalKg, daysLogged) => {
  if (
    totalKg === null || totalKg === undefined || isNaN(totalKg) || totalKg <= 0 ||
    daysLogged === null || daysLogged === undefined || isNaN(daysLogged) || daysLogged <= 0
  ) {
    return 0;
  }
  // Use at least 7 days for averaging to prevent massive extrapolation
  // from a single day of logging.  As more days are logged the estimate
  // becomes progressively more accurate.
  const effectiveDays = Math.max(daysLogged, 7);
  const dailyAverageKg = totalKg / effectiveDays;
  const annualKg = dailyAverageKg * 365;
  return annualKg / 1000; // convert to metric tonnes
};
