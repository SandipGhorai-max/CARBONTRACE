import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CarbonContext, CarbonProvider } from '../context/CarbonContext';
import { useContext } from 'react';
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

describe('CarbonContext.state.test.jsx — LOAD_DATA action', () => {
  it('loads persisted activities on mount (happy path)', async () => {
    const today = new Date().toISOString().split('T')[0];
    const savedState = {
      activities: [
        { id: 'x1', date: new Date().toISOString(), category: 'Transport', type: 'car', amount: 5, co2: 2 },
      ],
      streak: 3,
      lastLoginDate: today,
    };

    vi.spyOn(firestoreHook, 'useFirestore').mockReturnValue({
      load: vi.fn().mockResolvedValue(savedState),
      save: vi.fn().mockResolvedValue(true)
    });

    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    expect(result.current.state.activities).toHaveLength(1);
    expect(result.current.state.streak).toBe(3);
  });

  it('starts with empty state when load returns null (edge case)', async () => {
    vi.spyOn(firestoreHook, 'useFirestore').mockReturnValue({
      load: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(true)
    });

    const { result } = renderHook(() => useContext(CarbonContext), { wrapper });
    await waitForLoad({ result });

    expect(result.current.state.activities).toEqual([]);
  });
});
