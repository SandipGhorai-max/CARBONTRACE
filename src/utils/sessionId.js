import { STORAGE_KEYS } from '../constants';
import { generateId } from './generateId';

/**
 * Retrieves or creates a stable anonymous session ID.
 * Persisted to localStorage so it survives refreshes.
 * @returns {string} The session ID.
 */
export const getSessionId = () => {
  let id = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!id) {
    id = generateId();
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, id);
  }
  return id;
};
