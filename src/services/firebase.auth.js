import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from './firebase.config';

let auth = null;

if (app) {
  auth = getAuth(app);
}

/**
 * Sign in anonymously using Firebase Auth.
 * @returns {Promise<Object|null>} user credentials or null.
 */
export const signInAnonymous = async () => {
  if (!auth) return null;
  try {
    return await signInAnonymously(auth);
  } catch (_) {
    return null;
  }
};

export { auth };
