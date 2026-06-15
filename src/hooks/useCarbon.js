import { useMemo, useCallback, useContext } from 'react';
import { CarbonContext } from '../context/CarbonContext';
import { calculateActivityCO2, summarizeByCategory, getHighestImpactCategory, calculateAnnualProjection } from '../utils/calculations';

/**
 * Custom hook to interact with CarbonContext.
 * Calculates memoized summaries and projections.
 */
export const useCarbon = () => {
  const context = useContext(CarbonContext);
  
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  
  const { state, dispatch } = context;

  // Add activity with generated ID and calculated CO2
  const addActivity = useCallback((activity) => {
    const co2 = calculateActivityCO2(activity.category, activity.type, activity.amount);
    const newActivity = {
      ...activity,
      // fallback to Math.random if crypto is unavailable in test environment
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      co2
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
  }, [dispatch]);

  const resetData = useCallback(() => {
    dispatch({ type: 'RESET_DATA' });
  }, [dispatch]);

  // Memoize calculations to prevent unnecessary re-renders
  const summary = useMemo(() => summarizeByCategory(state.activities), [state.activities]);
  
  const highestImpactCategory = useMemo(() => getHighestImpactCategory(summary), [summary]);

  const totalCO2Kg = useMemo(() => {
    return Object.values(summary).reduce((sum, val) => sum + val, 0);
  }, [summary]);

  const daysLogged = useMemo(() => {
    const uniqueDates = new Set(state.activities.map(a => a.date.split('T')[0]));
    return Math.max(1, uniqueDates.size);
  }, [state.activities]);

  const projectedAnnualTons = useMemo(() => {
    return calculateAnnualProjection(totalCO2Kg, daysLogged);
  }, [totalCO2Kg, daysLogged]);

  return {
    activities: state.activities,
    streak: state.streak,
    summary,
    highestImpactCategory,
    totalCO2Kg,
    projectedAnnualTons,
    addActivity,
    resetData
  };
};
