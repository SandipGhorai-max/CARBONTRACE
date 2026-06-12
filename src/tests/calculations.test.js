import { describe, it, expect } from 'vitest';
import {
  calculateActivityCO2,
  summarizeByCategory,
  getHighestImpactCategory,
  calculateAnnualProjection,
} from '../utils/calculations';
import { CATEGORIES } from '../constants/carbonFactors';

describe('calculations.js', () => {

  // ─── calculateActivityCO2 ────────────────────────────────────────────────
  describe('calculateActivityCO2', () => {
    it('calculates correctly for valid inputs (happy path)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', 10)).toBe(4.0);
      expect(calculateActivityCO2(CATEGORIES.FOOD, 'meat', 2)).toBe(5.0);
      expect(calculateActivityCO2(CATEGORIES.ENERGY, 'electricity', 50)).toBe(20.0);
    });

    it('handles zero amount (edge case)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', 0)).toBe(0);
    });

    it('handles negative amount (edge case)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', -10)).toBe(0);
    });

    it('returns 0 for NaN amount (edge case)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', NaN)).toBe(0);
    });

    it('returns 0 for null amount (failure case)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', null)).toBe(0);
    });

    it('returns 0 for unknown category (failure case)', () => {
      expect(calculateActivityCO2('Unknown', 'car', 10)).toBe(0);
    });

    it('returns 0 for unknown activity type (failure case)', () => {
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'spaceship', 10)).toBe(0);
    });

    it('handles floating-point amounts correctly (edge case)', () => {
      // 0.5 miles by car = 0.5 * 0.4 = 0.2
      expect(calculateActivityCO2(CATEGORIES.TRANSPORT, 'car', 0.5)).toBeCloseTo(0.2, 5);
    });
  });

  // ─── summarizeByCategory ─────────────────────────────────────────────────
  describe('summarizeByCategory', () => {
    it('summarises correctly across multiple categories (happy path)', () => {
      const activities = [
        { category: CATEGORIES.TRANSPORT, co2: 10 },
        { category: CATEGORIES.FOOD, co2: 5 },
        { category: CATEGORIES.TRANSPORT, co2: 2 },
      ];
      const res = summarizeByCategory(activities);
      expect(res[CATEGORIES.TRANSPORT]).toBe(12);
      expect(res[CATEGORIES.FOOD]).toBe(5);
    });

    it('handles empty array (edge case)', () => {
      expect(summarizeByCategory([])).toEqual({});
    });

    it('handles undefined co2 field gracefully (edge case)', () => {
      const activities = [{ category: CATEGORIES.TRANSPORT, co2: undefined }];
      const res = summarizeByCategory(activities);
      expect(res[CATEGORIES.TRANSPORT]).toBe(0);
    });

    it('handles co2 of 0 without omitting the category (edge case)', () => {
      const activities = [{ category: CATEGORIES.FOOD, co2: 0 }];
      const res = summarizeByCategory(activities);
      expect(Object.keys(res)).toContain(CATEGORIES.FOOD);
      expect(res[CATEGORIES.FOOD]).toBe(0);
    });

    it('handles no argument (failure case)', () => {
      expect(summarizeByCategory()).toEqual({});
    });
  });

  // ─── getHighestImpactCategory ─────────────────────────────────────────────
  describe('getHighestImpactCategory', () => {
    it('finds the maximum category correctly (happy path)', () => {
      const summary = {
        [CATEGORIES.TRANSPORT]: 10,
        [CATEGORIES.FOOD]: 20,
        [CATEGORIES.ENERGY]: 5,
      };
      expect(getHighestImpactCategory(summary)).toBe(CATEGORIES.FOOD);
    });

    it('returns the first entry on a tie (edge case)', () => {
      // Both categories have equal co2 — should return one deterministically
      const summary = {
        [CATEGORIES.TRANSPORT]: 15,
        [CATEGORIES.FOOD]: 15,
      };
      const result = getHighestImpactCategory(summary);
      expect([CATEGORIES.TRANSPORT, CATEGORIES.FOOD]).toContain(result);
    });

    it('handles a single category (edge case)', () => {
      expect(getHighestImpactCategory({ [CATEGORIES.ENERGY]: 42 })).toBe(CATEGORIES.ENERGY);
    });

    it('returns null for an empty object (failure case)', () => {
      expect(getHighestImpactCategory({})).toBeNull();
    });

    it('returns null for no argument (failure case)', () => {
      expect(getHighestImpactCategory()).toBeNull();
    });
  });

  // ─── calculateAnnualProjection ────────────────────────────────────────────
  describe('calculateAnnualProjection', () => {
    it('calculates annual projection correctly with 7-day minimum (happy path)', () => {
      // 10kg over 1 day → effectiveDays = max(1,7) = 7 → 10/7 * 365 / 1000 ≈ 0.5214
      expect(calculateAnnualProjection(10, 1)).toBeCloseTo(0.5214, 3);
    });

    it('distributes across multiple days when above 7 (happy path)', () => {
      // 100kg over 10 days → effectiveDays = 10 → 10kg/day → 10 * 365 / 1000 = 3.65 tonnes
      expect(calculateAnnualProjection(100, 10)).toBe(3.65);
    });

    it('returns 0 for zero days (edge case)', () => {
      expect(calculateAnnualProjection(10, 0)).toBe(0);
    });

    it('returns 0 for negative days (edge case)', () => {
      expect(calculateAnnualProjection(10, -1)).toBe(0);
    });

    it('returns 0 for negative totalKg (edge case)', () => {
      expect(calculateAnnualProjection(-10, 5)).toBe(0);
    });

    it('returns 0 for NaN inputs (failure case)', () => {
      expect(calculateAnnualProjection(NaN, 5)).toBe(0);
      expect(calculateAnnualProjection(10, NaN)).toBe(0);
    });

    it('returns 0 for zero totalKg (edge case)', () => {
      expect(calculateAnnualProjection(0, 5)).toBe(0);
    });
  });

});
