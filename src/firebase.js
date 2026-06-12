/**
 * Firebase initialization module.
 * Integrates Firebase Analytics for user event tracking and
 * Firebase Realtime Database for persistent cloud storage.
 *
 * Firebase client-side keys are intentionally public and are
 * secured via Firebase Security Rules on the server.
 */
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required config keys are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

let app = null;
let analytics = null;
let database = null;

if (missingKeys.length === 0) {
  try {
    app = initializeApp(firebaseConfig);

    // Analytics is only available in browser environments
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }

    database = getDatabase(app);
  } catch (err) {
    // Gracefully degrade — app works offline without Firebase
    console.warn('[CarbonTrace] Firebase initialization failed. Running in offline mode.', err.message);
  }
} else {
  console.warn(`[CarbonTrace] Firebase config missing keys: ${missingKeys.join(', ')}. Running in offline mode.`);
}

/**
 * Logs a custom analytics event safely (no-op if Firebase unavailable).
 * @param {string} eventName
 * @param {Object} params
 */
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (err) {
      // Silently fail — analytics is non-critical
    }
  }
};

/**
 * Saves user carbon data to Firebase RTDB under an anonymous session key.
 * Falls back to localStorage-only if Firebase is unavailable.
 * @param {string} sessionId
 * @param {Object} data
 */
export const saveToCloud = async (sessionId, data) => {
  if (!database) return;
  try {
    const userRef = ref(database, `users/${sessionId}`);
    await set(userRef, {
      ...data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    // Non-fatal — localStorage is the primary fallback
    console.warn('[CarbonTrace] Cloud save failed, data persisted locally.', err.message);
  }
};

/**
 * Loads user carbon data from Firebase RTDB.
 * Returns null if unavailable.
 * @param {string} sessionId
 * @returns {Promise<Object|null>}
 */
export const loadFromCloud = async (sessionId) => {
  if (!database) return null;
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${sessionId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (err) {
    console.warn('[CarbonTrace] Cloud load failed, using local data.', err.message);
    return null;
  }
};

export { app, analytics, database };
