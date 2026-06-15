/**
 * firebase.test.js — Mock-based tests for the firebase.js module.
 *
 * We cannot initialize a real Firebase app in the test environment,
 * so we verify that:
 *  1. All exported functions are callable without throwing.
 *  2. The functions degrade gracefully (no-op) when Firebase is unavailable.
 *  3. trackEvent handles edge cases (empty name, extra params).
 *  4. saveToCloud / loadFromCloud handle null/undefined session IDs gracefully.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock the firebase SDK so no real network calls are made ──────────────────
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => null),
  logEvent: vi.fn(),
}));
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => null),
  ref: vi.fn(),
  set: vi.fn(() => Promise.resolve()),
  get: vi.fn(() => Promise.resolve({ exists: () => false, val: () => null })),
  child: vi.fn(),
}));
vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => null),
  trace: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));

// Import AFTER mocking
import { trackEvent, saveToCloud, loadFromCloud, startPerfTrace } from '../firebase';

describe('firebase.js module', () => {

  // ─── trackEvent ──────────────────────────────────────────────────────────
  describe('trackEvent', () => {
    it('does not throw when analytics is unavailable (offline mode)', () => {
      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('does not throw with empty params object (edge case)', () => {
      expect(() => trackEvent('test_event', {})).not.toThrow();
    });

    it('does not throw with undefined eventName (failure case)', () => {
      expect(() => trackEvent(undefined)).not.toThrow();
    });

    it('does not throw with rich params object (happy path)', () => {
      expect(() => trackEvent('activity_logged', {
        category: 'Transport',
        type: 'car',
        amount: 10,
      })).not.toThrow();
    });
  });

  // ─── startPerfTrace ──────────────────────────────────────────────────────
  describe('startPerfTrace', () => {
    it('returns an object with a stop() function (happy path)', () => {
      const t = startPerfTrace('test_trace');
      expect(t).toBeDefined();
      expect(typeof t.stop).toBe('function');
    });

    it('calling stop() does not throw (edge case)', () => {
      const t = startPerfTrace('test_trace');
      expect(() => t.stop()).not.toThrow();
    });

    it('works with empty trace name (edge case)', () => {
      expect(() => startPerfTrace('')).not.toThrow();
    });
  });

  // ─── saveToCloud ─────────────────────────────────────────────────────────
  describe('saveToCloud', () => {
    it('resolves without throwing when database is null (offline mode)', async () => {
      await expect(saveToCloud('session-abc', { activities: [] })).resolves.toBeUndefined();
    });

    it('handles undefined sessionId gracefully (failure case)', async () => {
      await expect(saveToCloud(undefined, { activities: [] })).resolves.not.toThrow?.();
    });

    it('handles null data gracefully (failure case)', async () => {
      await expect(saveToCloud('session-abc', null)).resolves.toBeUndefined();
    });
  });

  // ─── loadFromCloud ───────────────────────────────────────────────────────
  describe('loadFromCloud', () => {
    it('returns null when database is unavailable (offline mode)', async () => {
      const result = await loadFromCloud('session-abc');
      expect(result).toBeNull();
    });

    it('handles undefined sessionId gracefully (failure case)', async () => {
      await expect(loadFromCloud(undefined)).resolves.toBeNull();
    });

    it('returns null when no data exists for the session (edge case)', async () => {
      const result = await loadFromCloud('nonexistent-session-id');
      expect(result).toBeNull();
    });
  });

});
