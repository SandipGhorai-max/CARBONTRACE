/**
 * @fileoverview Centralised constants for CarbonTrace.
 * Every magic number, threshold, timing, key, and event name lives here.
 * No other source file may contain inline literals — import from this module.
 */

// ── Emission categories ──────────────────────────────────────────────────────
export const CATEGORIES = {
  TRANSPORT: 'Transport',
  FOOD: 'Food',
  ENERGY: 'Energy',
  SHOPPING: 'Shopping',
};

// ── Emission factors (kg CO₂e per unit) — DEFRA UK 2023 ──────────────────────
export const CARBON_FACTORS = {
  [CATEGORIES.TRANSPORT]: {
    car: { value: 0.4, unit: 'kg/mile', label: 'Car (miles)' },
    bus: { value: 0.1, unit: 'kg/mile', label: 'Bus (miles)' },
    flight: { value: 0.2, unit: 'kg/mile', label: 'Flight (miles)' },
  },
  [CATEGORIES.FOOD]: {
    meat: { value: 2.5, unit: 'kg/meal', label: 'Meat-based meal' },
    vegetarian: { value: 0.8, unit: 'kg/meal', label: 'Vegetarian meal' },
    vegan: { value: 0.4, unit: 'kg/meal', label: 'Vegan meal' },
  },
  [CATEGORIES.ENERGY]: {
    electricity: { value: 0.4, unit: 'kg/kWh', label: 'Electricity (kWh)' },
    heating: { value: 0.2, unit: 'kg/kWh', label: 'Heating (kWh)' },
  },
  [CATEGORIES.SHOPPING]: {
    clothing: { value: 15.0, unit: 'kg/item', label: 'Clothing (item)' },
    electronics: { value: 50.0, unit: 'kg/item', label: 'Electronics (item)' },
  },
};

// ── CO₂ thresholds (annual tonnes) ──────────────────────────────────────────
export const GLOBAL_AVERAGE_TONS = 4.0;
export const PARIS_AGREEMENT_TONS = 2.0;
export const CRITICAL_THRESHOLD_TONS = 6.0;
export const CO2_GREEN_MAX = 2.0;
export const CO2_AMBER_MAX = 4.0;

// ── Validation limits ────────────────────────────────────────────────────────
export const VALIDATION = {
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 10000,
};

/** @deprecated Use VALIDATION.AMOUNT_MAX */
export const AMOUNT_MAX = VALIDATION.AMOUNT_MAX;
/** @deprecated Use VALIDATION.AMOUNT_MIN */
export const AMOUNT_MIN = VALIDATION.AMOUNT_MIN;

// ── UI timings (ms) ─────────────────────────────────────────────────────────
export const TIMINGS = {
  DEBOUNCE_INPUT: 300,
  RATE_LIMIT_WINDOW: 3000,
  SUCCESS_DISPLAY_MS: 2000,
  TYPEWRITER_CHAR_DELAY: 30,
  TOAST_DURATION: 4000,
};

/** @deprecated Use TIMINGS.DEBOUNCE_INPUT */
export const DEBOUNCE_DELAY_MS = TIMINGS.DEBOUNCE_INPUT;
/** @deprecated Use TIMINGS.RATE_LIMIT_WINDOW */
export const RATE_LIMIT_MS = TIMINGS.RATE_LIMIT_WINDOW;

// ── Projection ───────────────────────────────────────────────────────────────
export const PROJECTION = {
  MIN_DAYS: 7,
  DAYS_PER_YEAR: 365,
  KG_PER_TONNE: 1000,
};

/** @deprecated Use PROJECTION.MIN_DAYS */
export const PROJECTION_MIN_DAYS = PROJECTION.MIN_DAYS;

// ── Time ─────────────────────────────────────────────────────────────────────
export const MS_PER_DAY = 86_400_000;

// ── Chart ────────────────────────────────────────────────────────────────────
export const CHART_CONFIG = {
  MAX_HISTORY_DAYS: 7,
  ANIMATION_DURATION: 1000,
  BAR_COLOR: '#22d3ee',
  AXIS_COLOR: '#94a3b8',
  GRID_COLOR: '#334155',
};

// ── Sound ────────────────────────────────────────────────────────────────────
export const SOUND_CONFIG = {
  HUM_FREQ: 60,
  HUM_GAIN: 0.015,
  GAIN_RAMP_TIME: 0.1,
  BEEP: { START: 880, END: 1760, GAIN: 0.08, DECAY: 0.001, DURATION: 0.3 },
  ALERT: { FREQ_A: 440, FREQ_B: 330, GAIN: 0.06, DECAY: 0.001, DURATION: 0.5 },
  SUCCESS: { FREQS: [523, 659, 784, 1047], GAIN_PEAK: 0.06, DECAY: 0.001, NOTE_GAP: 0.1, NOTE_LEN: 0.3 },
};

// ── localStorage keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  SESSION_ID: 'carbonTraceSessionId',
  DATA: 'carbonTraceData',
};

// ── Firebase Analytics event names ───────────────────────────────────────────
export const ANALYTICS_EVENTS = {
  ACTIVITY_LOGGED: 'activity_logged',
  DATA_EXPORT: 'data_export',
  DAILY_VISIT: 'daily_visit',
  APP_LOADED: 'app_loaded',
};

// ── Gamification ─────────────────────────────────────────────────────────────
export const GAMIFICATION = {
  POINTS_PER_KG_SAVED: 10,
  STREAK_BONUS: 1.5,
};

// ── AI Insight messages by level ─────────────────────────────────────────────
export const INSIGHT_MESSAGES = {
  green: "Your footprint is well below average. Keep maintaining your sustainable habits! You're a climate champion.",
  amber: "You're within average limits. Consider replacing short car trips with biking or adjusting your thermostat to reduce further.",
  red: "Your emissions are high. Focus on major reduction areas: reducing meat intake, flying less, and switching to renewable energy.",
};

// ── AI Insight level style map ───────────────────────────────────────────────
export const LEVEL_STYLES = {
  green: { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-500' },
  amber: { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500' },
  red: { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-500' },
};
