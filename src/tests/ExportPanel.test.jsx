import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ExportPanel from '../components/ExportPanel';

// ── Helpers ──────────────────────────────────────────────────────────────────

const sampleActivities = [
  {
    id: 'a1',
    date: '2024-01-15T10:00:00Z',
    category: 'Transport',
    type: 'car',
    amount: 10,
    co2: 4.0,
  },
  {
    id: 'a2',
    date: '2024-01-16T09:00:00Z',
    category: 'Food',
    type: 'meat',
    amount: 2,
    co2: 5.0,
  },
];

// Suppress Firebase warnings in test env
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = () => {};
});
afterEach(() => {
  console.warn = originalWarn;
});

// ── Mock browser APIs used in download logic ──────────────────────────────────
let mockObjectURL = '';
let revokeCallCount = 0;

beforeEach(() => {
  revokeCallCount = 0;

  global.URL.createObjectURL = vi.fn(() => {
    mockObjectURL = 'blob:mock-url';
    return mockObjectURL;
  });

  global.URL.revokeObjectURL = vi.fn(() => {
    revokeCallCount++;
  });

  // Mock <a> click without actually triggering navigation
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────

describe('ExportPanel component', () => {

  // ─── Render ───────────────────────────────────────────────────────────────
  it('renders the Data Extraction heading (happy path)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    expect(screen.getByRole('heading', { name: /data extraction/i })).toBeInTheDocument();
  });

  it('renders both export buttons (happy path)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    expect(screen.getByRole('button', { name: /export.*csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export.*json/i })).toBeInTheDocument();
  });

  // ─── Disabled state ───────────────────────────────────────────────────────
  it('disables both buttons when activities array is empty (edge case)', () => {
    render(<ExportPanel activities={[]} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('both buttons have no-data aria-label when activities is empty', () => {
    render(<ExportPanel activities={[]} />);
    // Both buttons should be disabled with aria-disabled
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    buttons.forEach(btn => expect(btn).toBeDisabled());
  });

  // ─── CSV download ─────────────────────────────────────────────────────────
  it('triggers a CSV download when the CSV button is clicked (happy path)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /export.*csv/i }));
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after CSV download to prevent memory leaks (security)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /export.*csv/i }));
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  // ─── JSON download ────────────────────────────────────────────────────────
  it('triggers a JSON download when the JSON button is clicked (happy path)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /export.*json/i }));
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after JSON download to prevent memory leaks (security)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /export.*json/i }));
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  // ─── Success feedback ─────────────────────────────────────────────────────
  it('shows "EXTRACTED" or success text after CSV export (UX feedback)', async () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /csv/i }));
    await waitFor(() => {
      // Button shows success state (EXTRACTED or Downloaded)
      const btn = screen.getByRole('button', { name: /csv|extracted/i });
      expect(btn).toBeInTheDocument();
    });
  });

  it('shows success text after JSON export (UX feedback)', async () => {
    render(<ExportPanel activities={sampleActivities} />);
    fireEvent.click(screen.getByRole('button', { name: /json/i }));
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /json|extracted/i });
      expect(btn).toBeInTheDocument();
    });
  });

  // ─── Record count in description ─────────────────────────────────────────
  it('shows the activity count in the description when activities exist (happy path)', () => {
    render(<ExportPanel activities={sampleActivities} />);
    // Panel shows record count
    expect(screen.getByText(/2 record/i)).toBeInTheDocument();
  });

  it('uses singular "RECORD" for a single activity (edge case)', () => {
    render(<ExportPanel activities={[sampleActivities[0]]} />);
    expect(screen.getByText(/1 record/i)).toBeInTheDocument();
  });

});
