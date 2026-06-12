import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ActivityForm from '../components/ActivityForm';
import { CarbonProvider } from '../context/CarbonContext';
import { CATEGORIES, CARBON_FACTORS } from '../constants/carbonFactors';

// Suppress Firebase warnings in test environment
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = () => {};
  localStorage.clear();
});
afterEach(() => {
  console.warn = originalWarn;
});

const renderWithProvider = (ui) => render(<CarbonProvider>{ui}</CarbonProvider>);

describe('ActivityForm component', () => {

  // ─── Render ───────────────────────────────────────────────────────────────
  it('renders all form fields and the transmit button (happy path)', () => {
    renderWithProvider(<ActivityForm />);
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    // Button has aria-label "Transmit carbon activity data"
    expect(screen.getByRole('button', { name: /transmit/i })).toBeInTheDocument();
  });

  it('renders the "REPORT FIELD DATA" heading (happy path)', () => {
    renderWithProvider(<ActivityForm />);
    expect(screen.getByRole('heading', { name: /report field data/i })).toBeInTheDocument();
  });

  // ─── Category change ─────────────────────────────────────────────────────
  it('updates activity types when category changes (happy path)', () => {
    renderWithProvider(<ActivityForm />);

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: CATEGORIES.FOOD } });

    const foodTypes = Object.values(CARBON_FACTORS[CATEGORIES.FOOD]).map((f) => f.label);
    foodTypes.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('resets amount when category changes (edge case)', () => {
    renderWithProvider(<ActivityForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '50' } });
    expect(amountInput.value).toBe('50');

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: CATEGORIES.FOOD } });

    expect(amountInput.value).toBe('');
  });

  // ─── Validation ──────────────────────────────────────────────────────────
  it('shows error for empty amount on submit (validation)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/valid number/i);
    });
  });

  it('shows error for non-numeric amount (validation)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/valid number/i);
    });
  });

  it('shows error for amount of zero (validation)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/greater than zero/i);
    });
  });

  it('shows error for amount greater than 10000 (validation)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '99999' } });
    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unrealistically high/i);
    });
  });

  // ─── Successful submit ───────────────────────────────────────────────────
  it('clears the amount field after a successful submission (happy path)', async () => {
    renderWithProvider(<ActivityForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(amountInput.value).toBe('');
    });
  });

  it('does not show an error after a successful submission (happy path)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────
  it('marks the amount input aria-invalid when there is an error (a11y)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('links error message to amount input via aria-describedby (a11y)', async () => {
    renderWithProvider(<ActivityForm />);

    fireEvent.click(screen.getByRole('button', { name: /transmit/i }));

    await waitFor(() => {
      const input = screen.getByLabelText(/amount/i);
      const describedById = input.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();
      expect(document.getElementById(describedById)).toBeInTheDocument();
    });
  });

});
