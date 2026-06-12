import '@testing-library/jest-dom';

// Suppress Firebase initialisation warnings in test environment
// (Firebase SDK emits warnings when config keys are missing/demo values)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    const msg = args[0] ? String(args[0]) : '';
    if (msg.includes('[CarbonTrace]') || msg.includes('Firebase') || msg.includes('firebase')) return;
    originalWarn(...args);
  };
  console.error = (...args) => {
    const msg = args[0] ? String(args[0]) : '';
    // Suppress React prop-types warnings in tests to keep output clean
    if (msg.includes('Warning: Failed prop type')) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
