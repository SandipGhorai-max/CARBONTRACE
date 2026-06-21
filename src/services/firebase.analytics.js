import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import { app } from './firebase.config';

let analytics = null;
let perf = null;

if (app && typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  perf = getPerformance(app);
}

/**
 * Logs a custom analytics event safely (no-op if Firebase unavailable).
 * @param {string} eventName - GA4 event name (snake_case recommended).
 * @param {Object} params - Additional event parameters.
 */
export const trackEvent = (eventName, params = {}) => {
  if (analytics && eventName) {
    try {
      logEvent(analytics, eventName, {
        ...params,
        app_version: '1.1.0',
        platform: 'web',
      });
    } catch (_) {
      // Silently fail — analytics is non-critical
    }
  }
};

/**
 * Starts a Firebase Performance Monitoring custom trace.
 * @param {string} traceName - The name of the custom trace.
 * @returns {{ stop: () => void }} - Object with a stop() method.
 */
export const startPerfTrace = (traceName) => {
  if (perf && traceName) {
    try {
      const t = trace(perf, traceName);
      t.start();
      return { stop: () => { try { t.stop(); } catch (_) {} } };
    } catch (_) {}
  }
  return { stop: () => {} };
};

export { analytics, perf };
