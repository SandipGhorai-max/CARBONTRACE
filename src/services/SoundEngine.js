import { SOUND_CONFIG } from '../constants';

/**
 * SoundEngine
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
      // Graceful degradation without console noise in production
    }
  }

  startHum() {
    if (!this.ctx || this.humNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = SOUND_CONFIG.HUM_FREQ;
    gain.gain.value = this.muted ? 0 : SOUND_CONFIG.HUM_GAIN;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    this.humNode = osc;
    this.humGain = gain;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.humGain) {
      this.humGain.gain.setTargetAtTime(muted ? 0 : SOUND_CONFIG.HUM_GAIN, this.ctx.currentTime, SOUND_CONFIG.GAIN_RAMP_TIME);
    }
  }

  playBeep() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(SOUND_CONFIG.BEEP.START, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(SOUND_CONFIG.BEEP.END, this.ctx.currentTime + SOUND_CONFIG.GAIN_RAMP_TIME);
    gain.gain.setValueAtTime(SOUND_CONFIG.BEEP.GAIN, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(SOUND_CONFIG.BEEP.DECAY, this.ctx.currentTime + SOUND_CONFIG.BEEP.DURATION);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + SOUND_CONFIG.BEEP.DURATION);
  }

  playAlert() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(SOUND_CONFIG.ALERT.FREQ_A, this.ctx.currentTime);
    osc.frequency.setValueAtTime(SOUND_CONFIG.ALERT.FREQ_B, this.ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(SOUND_CONFIG.ALERT.FREQ_A, this.ctx.currentTime + SOUND_CONFIG.BEEP.DURATION);
    gain.gain.setValueAtTime(SOUND_CONFIG.ALERT.GAIN, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(SOUND_CONFIG.ALERT.DECAY, this.ctx.currentTime + SOUND_CONFIG.ALERT.DURATION);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + SOUND_CONFIG.ALERT.DURATION);
  }

  playSuccess() {
    if (!this.ctx || this.muted) return;
    SOUND_CONFIG.SUCCESS.FREQS.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * SOUND_CONFIG.SUCCESS.NOTE_GAP);
      gain.gain.linearRampToValueAtTime(SOUND_CONFIG.SUCCESS.GAIN_PEAK, this.ctx.currentTime + i * SOUND_CONFIG.SUCCESS.NOTE_GAP + 0.05);
      gain.gain.exponentialRampToValueAtTime(SOUND_CONFIG.SUCCESS.DECAY, this.ctx.currentTime + i * SOUND_CONFIG.SUCCESS.NOTE_GAP + SOUND_CONFIG.SUCCESS.NOTE_LEN);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * SOUND_CONFIG.SUCCESS.NOTE_GAP);
      osc.stop(this.ctx.currentTime + i * SOUND_CONFIG.SUCCESS.NOTE_GAP + SOUND_CONFIG.SUCCESS.NOTE_LEN);
    });
  }
}

export const soundEngineInstance = new SoundEngine();
