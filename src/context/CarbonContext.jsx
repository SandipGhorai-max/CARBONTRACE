import React, { createContext, useReducer, useEffect, useRef } from 'react';
import { CarbonProviderProps } from '../types/propTypes';
import { carbonReducer, initialState } from './carbonReducer';
import { getSessionId } from '../utils/sessionId';
import { calculateStreak } from '../utils/streakCalculator';
import { useFirestore } from '../hooks/useFirestore';
import { startPerfTrace, trackEvent } from '../services/firebase.analytics';
import { ANALYTICS_EVENTS } from '../constants';

export const CarbonContext = createContext(null);

/**
 * Provider for the Carbon context.
 * Manages global state, persistence, and synchronization.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
export const CarbonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carbonReducer, initialState);
  const { save, load } = useFirestore();
  const sessionId = useRef(getSessionId());
  const initialLoadDone = useRef(false);

  // Load initial data from Firebase
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const trace = startPerfTrace('initial_load');
      const data = await load(sessionId.current);
      if (!mounted) {
        trace.stop();
        return;
      }
      
      if (data) {
        dispatch({ type: 'LOAD_DATA', payload: data });
      }
      
      const today = new Date().toISOString().split('T')[0];
      const streak = calculateStreak(data?.lastLoginDate || state.lastLoginDate, data?.streak || state.streak, today);
      
      dispatch({ type: 'UPDATE_STREAK', payload: { streak, lastLoginDate: today } });
      
      if (!data?.lastLoginDate || data.lastLoginDate !== today) {
        trackEvent(ANALYTICS_EVENTS.DAILY_VISIT, { streak });
      }

      initialLoadDone.current = true;
      trace.stop();
    };

    loadData();
    return () => { mounted = false; };
    // We intentionally only run this on mount, matching expected behavior.
    // The previous eslint-disable-line is removed; instead we depend only on load
    // which is memoized, and state which is not used directly in deps for the initial fetch.
  }, [load]);

  // Sync state changes to Firebase
  useEffect(() => {
    if (!initialLoadDone.current) return;
    save(sessionId.current, state);
  }, [state, save]);

  return (
    <CarbonContext.Provider value={{ state, dispatch }}>
      {children}
    </CarbonContext.Provider>
  );
};

CarbonProvider.propTypes = CarbonProviderProps;
