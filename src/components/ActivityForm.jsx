import React, { useState, useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, CARBON_FACTORS } from '../constants/carbonFactors';
import { useCarbon } from '../hooks/useCarbon';
import { trackEvent } from '../firebase';
import { PlusCircle, AlertCircle } from 'lucide-react';

const ActivityForm = () => {
  const { addActivity } = useCarbon();
  const [category, setCategory] = useState(CATEGORIES.TRANSPORT);
  const [type, setType] = useState(Object.keys(CARBON_FACTORS[CATEGORIES.TRANSPORT])[0]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const errorId = useId();

  useEffect(() => {
    setType(Object.keys(CARBON_FACTORS[category])[0]);
    setAmount('');
    setError('');
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);

    if (amount.trim() === '' || isNaN(numAmount)) {
      setError('Please enter a valid number.');
      return;
    }
    if (numAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (numAmount > 10000) {
      setError('Amount seems unrealistically high. Please verify and try again.');
      return;
    }

    addActivity({ category, type, amount: numAmount });

    // Track activity logging as a Firebase Analytics event
    trackEvent('activity_logged', { category, type, amount: numAmount });

    setAmount('');
  };

  const selectedFactor = CARBON_FACTORS[category]?.[type];

  return (
    <form
      onSubmit={handleSubmit}
      className="glass p-6 md:p-8 rounded-3xl flex flex-col gap-5 w-full transition-all hover:border-cyan/50"
      noValidate
    >
      <h2 className="text-2xl font-bold font-orbitron text-gray-100 flex items-center gap-2">
        Log Activity
      </h2>

      {error && (
        <div
          id={errorId}
          className="p-4 bg-coral/10 text-coral rounded-xl text-sm flex items-start gap-3 border border-coral/30"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="activity-category" className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-inter">
          Category
        </label>
        <select
          id="activity-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3.5 rounded-xl border border-cardBorder bg-space text-gray-200 focus:bg-card focus:ring-1 focus:ring-cyan focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.3)] outline-none transition-all"
          aria-label="Select activity category"
        >
          {Object.values(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="activity-type" className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-inter">
          Activity Type
        </label>
        <select
          id="activity-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3.5 rounded-xl border border-cardBorder bg-space text-gray-200 focus:bg-card focus:ring-1 focus:ring-cyan focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.3)] outline-none transition-all"
          aria-label="Select activity type"
        >
          {Object.entries(CARBON_FACTORS[category]).map(([key, data]) => (
            <option key={key} value={key}>{data.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="activity-amount" className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-inter">
          Amount{' '}
          {selectedFactor && (
            <span className="text-gray-500 font-normal normal-case tracking-normal">
              ({selectedFactor.unit.split('/')[1]})
            </span>
          )}
        </label>
        <input
          id="activity-amount"
          type="number"
          step="any"
          min="0.01"
          max="10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 15"
          className="p-3.5 rounded-xl border border-cardBorder bg-space text-gray-200 placeholder:text-gray-600 focus:bg-card focus:ring-1 focus:ring-cyan focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.3)] outline-none transition-all font-orbitron text-lg"
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      <button
        type="submit"
        className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-electric to-cyan text-space p-4 rounded-xl font-bold font-orbitron tracking-wide transition-all hover:shadow-neon hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space active:scale-[0.98]"
        aria-label="Submit and log this carbon activity"
      >
        <PlusCircle size={22} aria-hidden="true" />
        <span>INITIATE LOG</span>
      </button>
    </form>
  );
};

ActivityForm.propTypes = {};

export default ActivityForm;
