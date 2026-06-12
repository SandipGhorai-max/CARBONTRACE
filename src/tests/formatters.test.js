import { describe, it, expect } from 'vitest';
import { formatNumber, generateCSV } from '../utils/formatters';

describe('formatters.js', () => {

  // ─── formatNumber ─────────────────────────────────────────────────────────
  describe('formatNumber', () => {
    it('formats a decimal number to 2 places (happy path)', () => {
      expect(formatNumber(1.2345)).toBe('1.23');
    });

    it('pads an integer with .00 (happy path)', () => {
      expect(formatNumber(5)).toBe('5.00');
    });

    it('handles zero correctly (edge case)', () => {
      expect(formatNumber(0)).toBe('0.00');
    });

    it('handles negative numbers (edge case)', () => {
      expect(formatNumber(-3.7)).toBe('-3.70');
    });

    it('handles very large numbers (edge case)', () => {
      expect(formatNumber(1_000_000)).toBe('1000000.00');
    });

    it('handles Infinity as 0.00 (edge case)', () => {
      // Infinity converted via toFixed is non-standard; guard returns '0.00'
      // Standard JS: Infinity.toFixed(2) === 'Infinity', so we expect '0.00' from the guard
      expect(formatNumber(Infinity)).toBe('0.00');
    });

    it('handles -Infinity as 0.00 (edge case)', () => {
      expect(formatNumber(-Infinity)).toBe('0.00');
    });

    it('handles null gracefully (failure case)', () => {
      expect(formatNumber(null)).toBe('0.00');
    });

    it('handles undefined gracefully (failure case)', () => {
      expect(formatNumber(undefined)).toBe('0.00');
    });

    it('handles NaN gracefully (failure case)', () => {
      expect(formatNumber(NaN)).toBe('0.00');
    });

    it('handles a non-numeric string gracefully (failure case)', () => {
      expect(formatNumber('abc')).toBe('0.00');
    });

    it('parses a numeric string correctly (edge case)', () => {
      // Number('3.14') is valid
      expect(formatNumber('3.14')).toBe('3.14');
    });

    it('supports custom decimal places (happy path)', () => {
      expect(formatNumber(1.23456, 4)).toBe('1.2346');
    });
  });

  // ─── generateCSV ─────────────────────────────────────────────────────────
  describe('generateCSV', () => {
    it('generates a correct CSV string (happy path)', () => {
      const activities = [
        {
          id: '1',
          date: '2023-01-01T12:00:00Z',
          category: 'Food',
          type: 'meat',
          amount: 1,
          co2: 2.5,
        },
      ];
      const csv = generateCSV(activities);
      expect(csv).toContain('id,date,category,type,amount,co2');
      expect(csv).toContain('1,2023-01-01,Food,meat,1,2.5');
    });

    it('includes header row only for an empty array (edge case)', () => {
      expect(generateCSV([])).toBe('id,date,category,type,amount,co2\n');
    });

    it('handles null input gracefully (failure case)', () => {
      expect(generateCSV(null)).toBe('id,date,category,type,amount,co2\n');
    });

    it('handles undefined input gracefully (failure case)', () => {
      expect(generateCSV(undefined)).toBe('id,date,category,type,amount,co2\n');
    });

    it('handles activity with missing fields gracefully (failure case)', () => {
      const csv = generateCSV([{ id: '1' }]);
      // id present; date/category/type empty; amount defaults to 0; co2 defaults to 0
      expect(csv).toContain('1,,,,0,0');
    });

    it('handles activity with co2 of 0 correctly (edge case)', () => {
      const activities = [
        { id: '2', date: '2023-06-01T00:00:00Z', category: 'Energy', type: 'electricity', amount: 10, co2: 0 },
      ];
      const csv = generateCSV(activities);
      expect(csv).toContain('0');
    });

    it('handles multiple activities (happy path)', () => {
      const activities = [
        { id: '1', date: '2023-01-01T00:00:00Z', category: 'Food', type: 'meat', amount: 1, co2: 2.5 },
        { id: '2', date: '2023-01-02T00:00:00Z', category: 'Transport', type: 'car', amount: 10, co2: 4.0 },
      ];
      const csv = generateCSV(activities);
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(3); // header + 2 data rows
    });
  });

});
