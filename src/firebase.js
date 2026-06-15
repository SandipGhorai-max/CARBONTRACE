/**
 * Firebase initialization module.
 * Integrates Firebase Analytics for user event tracking,
 * Firebase Performance Monitoring for load time and custom traces,
 * and Firebase Realtime Database for persistent cloud storage.
 *
 * Firebase client-side keys are intentionally public and are
 * secured via Firebase Security Rules on the server.
 *
 * Google Services used:
 *  - Firebase Analytics (logEvent)
 *  - Firebase Performance Monitoring (trace, perf metrics)
 *  - Firebase Realtime Database (RTDB read/write)
 *  - Cloud Run (hosting environment — see Dockerfile)
 */
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getPerformance, trace } from 'firebase/performance';

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
let perf = null;

if (missingKeys.length === 0) {
  try {
    app = initializeApp(firebaseConfig);

    // Analytics is only available in browser environments
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);

      // Firebase Performance Monitoring — automatically tracks page load metrics
      // and allows custom traces for critical user flows (e.g. data logging).
      perf = getPerformance(app);
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
 * Uses structured event naming convention for Google Analytics 4.
 * @param {string} eventName - GA4 event name (snake_case recommended)
 * @param {Object} params - Additional event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, {
        ...params,
        app_version: '1.1.0',
        platform: 'web',
      });
    } catch (err) {
      // Silently fail — analytics is non-critical
    }
  }
};

/**
 * Starts a Firebase Performance Monitoring custom trace.
 * Use to measure specific user-initiated operations.
 * @param {string} traceName - The name of the custom trace
 * @returns {{ stop: () => void }} - Object with a stop() method
 */
export const startPerfTrace = (traceName) => {
  if (perf) {
    try {
      const t = trace(perf, traceName);
      t.start();
      return { stop: () => { try { t.stop(); } catch (_) {} } };
    } catch (_) {}
  }
  // No-op fallback when performance monitoring is unavailable
  return { stop: () => {} };
};

/**
 * Saves user carbon data to Firebase RTDB under an anonymous session key.
 * Falls back to localStorage-only if Firebase is unavailable.
 * @param {string} sessionId - Unique anonymous session identifier
 * @param {Object} data - Carbon activity state to persist
 */
export const saveToCloud = async (sessionId, data) => {
  if (!database) return;
  const t = startPerfTrace('cloud_save');
  try {
    const userRef = ref(database, `users/${sessionId}`);
    await set(userRef, {
      ...data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    // Non-fatal — localStorage is the primary fallback
    console.warn('[CarbonTrace] Cloud save failed, data persisted locally.', err.message);
  } finally {
    t.stop();
  }
};

/**
 * Loads user carbon data from Firebase RTDB.
 * Returns null if unavailable or no data exists for session.
 * @param {string} sessionId - Unique anonymous session identifier
 * @returns {Promise<Object|null>} Persisted state or null
 */
export const loadFromCloud = async (sessionId) => {
  if (!database) return null;
  const t = startPerfTrace('cloud_load');
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
  } finally {
    t.stop();
  }
};

export { app, analytics, database, perf };
