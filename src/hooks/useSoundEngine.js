import { useState, useCallback } from 'react';
import { soundEngineInstance } from '../services/SoundEngine';

/**
 * Custom hook to interact with the global SoundEngine.
 * @returns {Object} Sound engine controls.
 */
export const useSoundEngine = () => {
  const [muted, setMuted] = useState(true);

  const toggleMute = useCallback(() => {
    soundEngineInstance.init();
    soundEngineInstance.startHum();
    const next = !muted;
    setMuted(next);
    soundEngineInstance.setMuted(next);
  }, [muted]);

  return {
    muted,
    toggleMute,
    playBeep: () => soundEngineInstance.playBeep(),
    playAlert: () => soundEngineInstance.playAlert(),
    playSuccess: () => soundEngineInstance.playSuccess(),
  };
};
