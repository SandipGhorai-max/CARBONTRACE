import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ── Sound Manager ─────────────────────────────────────────────────────────
 * Generates procedural sounds using Web Audio API — no external files needed.
 * All sounds are created from oscillators and noise generators.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true; // Start muted — user must opt-in
    this.humNode = null;
    this.humGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('[SoundEngine] Web Audio API unavailable');
    }
  }

  startHum() {
    if (!this.ctx || this.humNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.value = this.muted ? 0 : 0.015;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    this.humNode = osc;
    this.humGain = gain;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.humGain) {
      this.humGain.gain.setTargetAtTime(muted ? 0 : 0.015, this.ctx.currentTime, 0.1);
    }
  }

  playBeep() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playAlert() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(330, this.ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playSuccess() {
    if (!this.ctx || this.muted) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.3);
    });
  }
}

const engine = new SoundEngine();

export const useSoundEngine = () => {
  const [muted, setMuted] = useState(true);

  const toggleMute = useCallback(() => {
    engine.init();
    engine.startHum();
    const next = !muted;
    setMuted(next);
    engine.setMuted(next);
  }, [muted]);

  return {
    muted,
    toggleMute,
    playBeep: () => engine.playBeep(),
    playAlert: () => engine.playAlert(),
    playSuccess: () => engine.playSuccess(),
  };
};

export default engine;
