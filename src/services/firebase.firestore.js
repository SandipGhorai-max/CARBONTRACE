import { getDatabase, ref, set, get, child } from 'firebase/database';
import { app } from './firebase.config';
import { startPerfTrace } from './firebase.analytics';
import { sanitizeEntry } from '../utils/sanitize';

let database = null;

if (app) {
  database = getDatabase(app);
}

/**
 * Saves user carbon data to Firebase RTDB under an anonymous session key.
 * Falls back to localStorage-only if Firebase is unavailable.
 * @param {string} sessionId - Unique anonymous session identifier.
 * @param {Object} data - Carbon activity state to persist.
 */
export const saveToCloud = async (sessionId, data) => {
  if (!database || !sessionId) return;
  const t = startPerfTrace('cloud_save');
  try {
    const userRef = ref(database, `users/${sessionId}`);
    
    // Sanitize entries if they exist
    const sanitizedData = data.activities 
      ? { ...data, activities: data.activities.map(sanitizeEntry) }
      : data;

    await set(userRef, {
      ...sanitizedData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    // Non-fatal — localStorage is the primary fallback
  } finally {
    t.stop();
  }
};

/**
 * Loads user carbon data from Firebase RTDB.
 * Returns null if unavailable or no data exists for session.
 * @param {string} sessionId - Unique anonymous session identifier.
 * @returns {Promise<Object|null>} Persisted state or null.
 */
export const loadFromCloud = async (sessionId) => {
  if (!database || !sessionId) return null;
  const t = startPerfTrace('cloud_load');
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${sessionId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (err) {
    return null;
  } finally {
    t.stop();
  }
};

export { database };
