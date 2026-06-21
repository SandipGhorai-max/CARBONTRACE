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

describe('CarbonContext.firebase.test.jsx — Integration flow', () => {
  it('calls save on state update (integration)', async () => {
    const saveMock = vi.fn().mockResolvedValue(true);
    vi.spyOn(firestoreHook, 'useFirestore').mockReturnValue({
      load: vi.fn().mockResolvedValue(null),
      save: saveMock
    });

    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    const newActivity = { id: 'p1', date: new Date().toISOString(), category: CATEGORIES.ENERGY, type: 'electricity', amount: 100, co2: 40 };
    await act(async () => {
      result.current.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    });

    // Wait for the useEffect to trigger save
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(saveMock).toHaveBeenCalled();
  });

  it('add → verify → reset → verify empty (integration)', async () => {
    vi.spyOn(firestoreHook, 'useFirestore').mockReturnValue({
      load: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(true)
    });

    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    const act1 = { id: 'i1', date: new Date().toISOString(), category: CATEGORIES.TRANSPORT, type: 'car', amount: 10, co2: 4 };
    const act2 = { id: 'i2', date: new Date().toISOString(), category: CATEGORIES.FOOD, type: 'meat', amount: 2, co2: 5 };

    await act(async () => {
      result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act1 });
      result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act2 });
    });

    expect(result.current.state.activities).toHaveLength(2);

    await act(async () => {
      result.current.dispatch({ type: 'RESET_DATA' });
    });

    expect(result.current.state.activities).toHaveLength(0);

    await act(async () => {
      result.current.dispatch({ type: 'ADD_ACTIVITY', payload: act1 });
    });
    expect(result.current.state.activities).toHaveLength(1);
  });
});
