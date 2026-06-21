import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CarbonContext, CarbonProvider } from '../context/CarbonContext';
import { useContext } from 'react';
import { CATEGORIES } from '../constants';
import * as firestoreHook from '../hooks/useFirestore';

const originalWarn = console.warn;
const originalError = console.error;
beforeEach(() => {
  console.warn = () => {};
  console.error = () => {};
  vi.spyOn(firestoreHook, 'useFirestore').mockReturnValue({
    load: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(true)
  });
});
afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
  vi.restoreAllMocks();
});

const wrapper = ({ children }) => React.createElement(CarbonProvider, null, children);

const waitForLoad = async (hookResult) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 60));
  });
  return hookResult;
};

describe('CarbonContext.actions.test.jsx', () => {
  it('ADD_ACTIVITY prepends the new activity (happy path)', async () => {
    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    const newActivity = { id: 'a1', date: new Date().toISOString(), category: CATEGORIES.FOOD, type: 'meat', amount: 1, co2: 2.5 };
    await act(async () => {
      result.current.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    });

    expect(result.current.state.activities[0]).toEqual(newActivity);
  });

  it('RESET_DATA clears activities but preserves streak (happy path)', async () => {
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

  it('UPDATE_STREAK updates streak and lastLoginDate correctly (happy path)', async () => {
    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    await act(async () => {
      result.current.dispatch({ type: 'UPDATE_STREAK', payload: { streak: 5, lastLoginDate: '2024-06-15' } });
    });

    expect(result.current.state.streak).toBe(5);
    expect(result.current.state.lastLoginDate).toBe('2024-06-15');
  });
});
