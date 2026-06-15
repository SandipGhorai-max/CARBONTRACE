import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CarbonContext, CarbonProvider } from '../context/CarbonContext';
import { useContext } from 'react';
import { CATEGORIES } from '../constants/carbonFactors';

// Silence Firebase & React warnings in test output
const originalWarn = console.warn;
const originalError = console.error;
beforeEach(() => {
  console.warn = () => {};
  console.error = () => {};
  localStorage.clear();
});
afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// ── Reducer unit tests (pure function, no DOM) ────────────────────────────────
// We import carbonReducer indirectly by exercising the context

const wrapper = ({ children }) => React.createElement(CarbonProvider, null, children);

const waitForLoad = async (hookResult) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 60));
  });
  return hookResult;
};

describe('CarbonContext — Reducer Actions', () => {

  // ─── LOAD_DATA ───────────────────────────────────────────────────────────
  describe('LOAD_DATA action', () => {
    it('loads persisted activities from localStorage on mount (happy path)', async () => {
      const savedState = {
        activities: [
          { id: 'x1', date: new Date().toISOString(), category: 'Transport', type: 'car', amount: 5, co2: 2 },
        ],
        streak: 3,
        lastLoginDate: null,
      };
      localStorage.setItem('carbonTraceData', JSON.stringify(savedState));

      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      expect(result.current.state.activities).toHaveLength(1);
      expect(result.current.state.streak).toBe(3);
    });

    it('starts with empty state when localStorage is empty (edge case)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      expect(result.current.state.activities).toEqual([]);
    });

    it('recovers gracefully from corrupted localStorage JSON (failure case)', async () => {
      localStorage.setItem('carbonTraceData', '{not valid json');
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      // Should not throw — should start with empty state
      expect(result.current.state.activities).toEqual([]);
    });
  });

  // ─── ADD_ACTIVITY ─────────────────────────────────────────────────────────
  describe('ADD_ACTIVITY action', () => {
    it('prepends the new activity to the front of the list (happy path)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      const newActivity = { id: 'a1', date: new Date().toISOString(), category: CATEGORIES.FOOD, type: 'meat', amount: 1, co2: 2.5 };
      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
      });

      expect(result.current.state.activities[0]).toEqual(newActivity);
    });

    it('accumulates activities correctly on multiple dispatches (happy path)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      const act1 = { id: 'a1', date: new Date().toISOString(), category: CATEGORIES.TRANSPORT, type: 'car', amount: 10, co2: 4 };
      const act2 = { id: 'a2', date: new Date().toISOString(), category: CATEGORIES.ENERGY, type: 'electricity', amount: 50, co2: 20 };

      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act1 });
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act2 });
      });

      expect(result.current.state.activities).toHaveLength(2);
    });
  });

  // ─── RESET_DATA ───────────────────────────────────────────────────────────
  describe('RESET_DATA action', () => {
    it('clears activities but preserves streak (happy path)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      const newActivity = { id: 'a1', date: new Date().toISOString(), category: CATEGORIES.FOOD, type: 'meat', amount: 1, co2: 2.5 };
      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
        result.current.dispatch({ type: 'UPDATE_STREAK', payload: { streak: 7, lastLoginDate: '2024-01-01' } });
      });

      await act(async () => {
        result.current.dispatch({ type: 'RESET_DATA' });
      });

      expect(result.current.state.activities).toHaveLength(0);
      expect(result.current.state.streak).toBe(7); // preserved!
    });

    it('does not throw when reset is called with already empty activities (edge case)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      expect(() => act(() => {
        result.current.dispatch({ type: 'RESET_DATA' });
      })).not.toThrow();
      expect(result.current.state.activities).toHaveLength(0);
    });
  });

  // ─── UPDATE_STREAK ────────────────────────────────────────────────────────
  describe('UPDATE_STREAK action', () => {
    it('updates streak and lastLoginDate correctly (happy path)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      await act(async () => {
        result.current.dispatch({ type: 'UPDATE_STREAK', payload: { streak: 5, lastLoginDate: '2024-06-15' } });
      });

      expect(result.current.state.streak).toBe(5);
      expect(result.current.state.lastLoginDate).toBe('2024-06-15');
    });
  });

  // ─── Full integration flow ────────────────────────────────────────────────
  describe('Full integration flow', () => {
    it('add → verify → reset → verify empty (integration)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      // Step 1: Add two activities
      const act1 = { id: 'i1', date: new Date().toISOString(), category: CATEGORIES.TRANSPORT, type: 'car', amount: 10, co2: 4 };
      const act2 = { id: 'i2', date: new Date().toISOString(), category: CATEGORIES.FOOD, type: 'meat', amount: 2, co2: 5 };

      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act1 });
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act2 });
      });

      expect(result.current.state.activities).toHaveLength(2);

      // Step 2: Reset
      await act(async () => {
        result.current.dispatch({ type: 'RESET_DATA' });
      });

      // Step 3: Verify empty
      expect(result.current.state.activities).toHaveLength(0);

      // Step 4: Re-add to confirm reducer still works post-reset
      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act1 });
      });
      expect(result.current.state.activities).toHaveLength(1);
    });

    it('persists state to localStorage after each dispatch (integration)', async () => {
      const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
      await waitForLoad({ result });

      const newActivity = { id: 'p1', date: new Date().toISOString(), category: CATEGORIES.ENERGY, type: 'electricity', amount: 100, co2: 40 };
      await act(async () => {
        result.current.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
      });

      // Allow the effect to run
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const persisted = JSON.parse(localStorage.getItem('carbonTraceData') || '{}');
      expect(persisted.activities).toBeDefined();
      expect(persisted.activities.length).toBeGreaterThan(0);
    });
  });
});
