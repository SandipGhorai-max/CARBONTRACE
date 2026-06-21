import { useCallback } from 'react';
import { saveToCloud, loadFromCloud } from '../services/firebase.firestore';

/**
 * Custom hook providing a clean abstraction for Firestore CRUD operations.
 * @returns {Object} functions for saving and loading.
 */
export const useFirestore = () => {
  const save = useCallback(async (sessionId, data) => {
    try {
      await saveToCloud(sessionId, data);
    } catch (_) {
      // Offline fallback is handled natively, silent fail.
    }
  }, []);

  const load = useCallback(async (sessionId) => {
    try {
      return await loadFromCloud(sessionId);
    } catch (_) {
      return null;
    }
  }, []);

  return { save, load };
};
