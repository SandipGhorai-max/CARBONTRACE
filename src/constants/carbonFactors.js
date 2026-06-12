export const CATEGORIES = {
  TRANSPORT: 'Transport',
  FOOD: 'Food',
  ENERGY: 'Energy',
  SHOPPING: 'Shopping',
};

// Factors in kg CO2e per unit
// Sources: EPA (epa.gov), Our World in Data (ourworldindata.org)
// We keep it simple and offline, no external APIs.
export const CARBON_FACTORS = {
  [CATEGORIES.TRANSPORT]: {
    car: { value: 0.4, unit: 'kg/mile', label: 'Car (miles)' }, // EPA estimate for average passenger vehicle
    bus: { value: 0.1, unit: 'kg/mile', label: 'Bus (miles)' },
    flight: { value: 0.2, unit: 'kg/mile', label: 'Flight (miles)' }
  },
  [CATEGORIES.FOOD]: {
    meat: { value: 2.5, unit: 'kg/meal', label: 'Meat-based meal' }, // Our World in Data: Food GHG emissions
    vegetarian: { value: 0.8, unit: 'kg/meal', label: 'Vegetarian meal' },
    vegan: { value: 0.4, unit: 'kg/meal', label: 'Vegan meal' }
  },
  [CATEGORIES.ENERGY]: {
    electricity: { value: 0.4, unit: 'kg/kWh', label: 'Electricity (kWh)' }, // EPA eGRID average
    heating: { value: 0.2, unit: 'kg/kWh', label: 'Heating (kWh)' }
  },
  [CATEGORIES.SHOPPING]: {
    clothing: { value: 15.0, unit: 'kg/item', label: 'Clothing (item)' }, // Average apparel lifecycle estimate
    electronics: { value: 50.0, unit: 'kg/item', label: 'Electronics (item)' }
  }
};

export const GLOBAL_AVERAGE_TONS = 4.0;
export const PARIS_AGREEMENT_TONS = 2.0;
