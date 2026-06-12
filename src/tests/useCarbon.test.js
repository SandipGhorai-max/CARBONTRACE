import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbon } from '../hooks/useCarbon';
import { CarbonProvider } from '../context/CarbonContext';
import { CATEGORIES } from '../constants/carbonFactors';

// Silence expected console.warn from Firebase when running tests
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = () => {};
  localStorage.clear();
});

afterEach(() => {
  console.warn = originalWarn;
});

const wrapper = ({ children }) => <CarbonProvider>{children}</CarbonProvider>;

describe('useCarbon.js', () => {

  // ─── Provider guard ──────────────────────────────────────────────────────
  it('throws error if used outside provider (failure case)', () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => renderHook(() => useCarbon())).toThrow(
      'useCarbon must be used within a CarbonProvider'
    );
    console.error = originalError;
  });

  // ─── addActivity ─────────────────────────────────────────────────────────
  it('adds a single activity and updates state correctly (happy path)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    expect(result.current.activities).toEqual([]);

    await act(async () => {
      result.current.addActivity({
        category: CATEGORIES.TRANSPORT,
        type: 'car',
        amount: 10,
      });
    });

    expect(result.current.activities).toHaveLength(1);
    expect(result.current.activities[0].category).toBe(CATEGORIES.TRANSPORT);
    expect(result.current.activities[0].co2).toBe(4.0);
    expect(result.current.totalCO2Kg).toBe(4.0);
  });

  it('handles multiple rapid addActivity calls (edge case)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    await act(async () => {
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: 10 });
      result.current.addActivity({ category: CATEGORIES.FOOD, type: 'meat', amount: 1 });
      result.current.addActivity({ category: CATEGORIES.ENERGY, type: 'electricity', amount: 5 });
    });

    expect(result.current.activities).toHaveLength(3);
    // 4.0 + 2.5 + 2.0 = 8.5
    expect(result.current.totalCO2Kg).toBeCloseTo(8.5, 5);
  });

  it('each activity gets a unique id (edge case)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    await act(async () => {
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: 5 });
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: 5 });
    });

    const ids = result.current.activities.map((a) => a.id);
    expect(new Set(ids).size).toBe(2); // all IDs unique
  });

  // ─── Projections & summary ───────────────────────────────────────────────
  it('calculates projections and highest impact correctly (happy path)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    await act(async () => {
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: 10 }); // 4kg
      result.current.addActivity({ category: CATEGORIES.FOOD, type: 'meat', amount: 2 });       // 5kg
    });

    expect(result.current.totalCO2Kg).toBe(9.0);
    expect(result.current.highestImpactCategory).toBe(CATEGORIES.FOOD);
    // All activities happen on the same day → daysLogged = 1
    // 9kg/day * 365 / 1000 = 3.285 tonnes
    expect(result.current.projectedAnnualTons).toBeCloseTo(3.285, 3);
  });

  it('returns 0 for projectedAnnualTons when there are no activities (edge case)', () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });
    expect(result.current.projectedAnnualTons).toBe(0);
  });

  it('returns null for highestImpactCategory when there are no activities (edge case)', () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });
    expect(result.current.highestImpactCategory).toBeNull();
  });

  // ─── resetData ───────────────────────────────────────────────────────────
  it('resets activities and totalCO2 but preserves streak (happy path)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    await act(async () => {
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: 10 });
    });

    expect(result.current.activities).toHaveLength(1);
    const streakBefore = result.current.streak;

    await act(async () => {
      result.current.resetData();
    });

    expect(result.current.activities).toHaveLength(0);
    expect(result.current.totalCO2Kg).toBe(0);
    // Streak should be preserved after reset
    expect(result.current.streak).toBe(streakBefore);
  });

  // ─── addActivity with invalid amount ─────────────────────────────────────
  it('stores 0 co2 for invalid (NaN) amount (failure case)', async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    await act(async () => {
      result.current.addActivity({ category: CATEGORIES.TRANSPORT, type: 'car', amount: NaN });
    });

    expect(result.current.activities).toHaveLength(1);
    expect(result.current.activities[0].co2).toBe(0);
    expect(result.current.totalCO2Kg).toBe(0);
  });

});
