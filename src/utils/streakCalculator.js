import { MS_PER_DAY } from '../constants';

/**
 * Calculates the current streak based on the last login date.
 * @param {string|null} lastLoginDate The ISO date string of the last login.
 * @param {number} currentStreak The current streak count.
 * @param {string} today The current ISO date string.
 * @returns {number} The newly calculated streak.
 */
export const calculateStreak = (lastLoginDate, currentStreak, today) => {
  let newStreak = currentStreak || 0;

  if (lastLoginDate) {
    const lastDate = new Date(lastLoginDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate - lastDate) / MS_PER_DAY);

    if (diffDays === 1) {
      newStreak += 1; // consecutive day
    } else if (diffDays > 1) {
      newStreak = 1; // streak broken — restart
    }
  } else {
    newStreak = 1; // very first login ever
  }

  return newStreak;
};
