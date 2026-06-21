/**
 * @fileoverview Pure reducer function for CarbonContext state management.
 */

export const initialState = {
  activities: [],
  streak: 0,
  lastLoginDate: null,
};

/**
 * Reducer for managing global state.
 * @param {Object} state Current state.
 * @param {Object} action Action object with type and payload.
 * @returns {Object} New state.
 */
export const carbonReducer = (state, action) => {
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
