export const CATEGORIES = {
  TRANSPORT: 'Transport',
  FOOD: 'Food',
  ENERGY: 'Energy',
  SHOPPING: 'Shopping',
};

// Factors in kg CO2e per unit
// Sources: EPA (epa.gov), Our World in Data (ourworldindata.org)
export const CARBON_FACTORS = {
  [CATEGORIES.TRANSPORT]: {
    car: { value: 0.4, unit: 'kg/mile', label: 'Car (miles)' },
    bus: { value: 0.1, unit: 'kg/mile', label: 'Bus (miles)' },
    flight: { value: 0.2, unit: 'kg/mile', label: 'Flight (miles)' }
  },
  [CATEGORIES.FOOD]: {
    meat: { value: 2.5, unit: 'kg/meal', label: 'Meat-based meal' },
    vegetarian: { value: 0.8, unit: 'kg/meal', label: 'Vegetarian meal' },
    vegan: { value: 0.4, unit: 'kg/meal', label: 'Vegan meal' }
  },
  [CATEGORIES.ENERGY]: {
    electricity: { value: 0.4, unit: 'kg/kWh', label: 'Electricity (kWh)' },
    heating: { value: 0.2, unit: 'kg/kWh', label: 'Heating (kWh)' }
  },
  [CATEGORIES.SHOPPING]: {
    clothing: { value: 15.0, unit: 'kg/item', label: 'Clothing (item)' },
    electronics: { value: 50.0, unit: 'kg/item', label: 'Electronics (item)' }
  }
};

// ── CO₂ Benchmarks (metric tonnes/year) ──────────────────────────────────────
export const GLOBAL_AVERAGE_TONS   = 4.0;
export const PARIS_AGREEMENT_TONS  = 2.0;
export const CRITICAL_THRESHOLD_TONS = 6.0;

// ── Footprint level thresholds ────────────────────────────────────────────────
export const CO2_GREEN_MAX = 2.0;   // ≤ 2t → Climate Champion (green)
export const CO2_AMBER_MAX = 4.0;   // ≤ 4t → Average Citizen  (amber)
// > CO2_AMBER_MAX              → High Emitter              (red)

// ── Form validation ───────────────────────────────────────────────────────────
export const AMOUNT_MAX = 10_000;   // max realistic value per entry
export const AMOUNT_MIN = 0.01;     // min non-zero value

// ── Animation / UX timings (ms) ───────────────────────────────────────────────
export const SUCCESS_DISPLAY_MS    = 2_000; // how long success state shows
export const PROCESSING_DISPLAY_MS = 1_500; // how long processing indicator shows
export const TYPEWRITER_DELAY_MS   =    30; // delay between typewriter chars
export const ANTENNA_PULSE_MS      = 2_000; // robot antenna signal pulse duration

// ── Projection smoothing ──────────────────────────────────────────────────────
export const PROJECTION_MIN_DAYS = 7; // minimum days used in annual projection

