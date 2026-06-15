import React, { createContext, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { saveToCloud, loadFromCloud, trackEvent } from '../firebase';

const initialState = {
  activities: [],
  streak: 0,
  lastLoginDate: null,
};

export const CarbonContext = createContext(null);

// Stable anonymous session ID — persisted to localStorage so it survives refreshes
const getSessionId = () => {
  let id = localStorage.getItem('carbonTraceSessionId');
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);
    localStorage.setItem('carbonTraceSessionId', id);
  }
  return id;
};

// Reducer for managing global state.
const carbonReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    case 'ADD_ACTIVITY': {
      const newActivities = [action.payload, ...state.activities];
      return { ...state, activities: newActivities };
    }
    case 'UPDATE_STREAK': {
      return { ...state, streak: action.payload.streak, lastLoginDate: action.payload.lastLoginDate };
    }
    case 'RESET_DATA':
      // Preserve streak and login date on reset — only clear activities
      return { ...initialState, lastLoginDate: state.lastLoginDate, streak: state.streak };
    default:
      return state;
  }
};

export const CarbonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carbonReducer, initialState);
  // Track if initial load is complete to avoid persisting before we've loaded
  const isLoaded = useRef(false);
  const sessionId = useRef(getSessionId());

  // Load from cloud (with localStorage fallback) and calculate streak on mount
  useEffect(() => {
    const loadData = async () => {
      const today = new Date().toISOString().split('T')[0];

      // Attempt cloud load first, fall back to localStorage
      let loadedState = null;
      try {
        loadedState = await loadFromCloud(sessionId.current);
      } catch (_) {
        // ignore
      }

      if (!loadedState) {
        const saved = localStorage.getItem('carbonTraceData');
        if (saved) {
          try {
            loadedState = JSON.parse(saved);
          } catch (_) {
            // Corrupted localStorage — start fresh
          }
        }
      }

      if (!loadedState) {
        loadedState = initialState;
      }

      dispatch({ type: 'LOAD_DATA', payload: loadedState });

      // Fix: Only update streak if we haven't logged in today yet.
      // This prevents streak from being re-calculated on every hard refresh.
      if (loadedState.lastLoginDate !== today) {
        let newStreak = loadedState.streak || 0;

        if (loadedState.lastLoginDate) {
          const lastDate = new Date(loadedState.lastLoginDate);
          const currDate = new Date(today);
          const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1; // consecutive day
          } else if (diffDays > 1) {
            newStreak = 1; // streak broken — restart
          }
          // diffDays === 0 is impossible here because lastLoginDate !== today
        } else {
          newStreak = 1; // very first login ever
        }

        dispatch({ type: 'UPDATE_STREAK', payload: { streak: newStreak, lastLoginDate: today } });

        trackEvent('daily_visit', { streak: newStreak });
      }

      isLoaded.current = true;
    };

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to both localStorage and Firebase whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded.current) return;

    // Always persist locally for offline resilience
    localStorage.setItem('carbonTraceData', JSON.stringify(state));

    // Async cloud sync — fire and forget
    saveToCloud(sessionId.current, state);
  }, [state]);

  return (
    <CarbonContext.Provider value={{ state, dispatch }}>
      {children}
    </CarbonContext.Provider>
  );
};

CarbonProvider.propTypes = {
  /** Child component tree that will have access to carbon state. */
  children: PropTypes.node.isRequired,
};
