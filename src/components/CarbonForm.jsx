import React, { useState, useEffect, useId, useRef } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, CARBON_FACTORS, AMOUNT_MAX, AMOUNT_MIN, RATE_LIMIT_MS } from '../constants';
import { useCarbon } from '../hooks/useCarbon';
import { useDebounce } from '../hooks/useDebounce';
import { trackEvent } from '../firebase';

const CarbonForm = ({ onLiveCo2Change }) => {
  const { addActivity } = useCarbon();
  const [category, setCategory] = useState(CATEGORIES.TRANSPORT);
  const [type, setType] = useState(Object.keys(CARBON_FACTORS[CATEGORIES.TRANSPORT])[0]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const lastSubmitTime = useRef(0);
  const errorId = useId();

  // Reset type when category changes
  useEffect(() => {
    setType(Object.keys(CARBON_FACTORS[category])[0]);
    setAmount('');
    setError('');
  }, [category]);

  const debouncedAmount = useDebounce(amount);

  // Live CO2 calculation
  useEffect(() => {
    const numAmount = parseFloat(debouncedAmount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const factor = CARBON_FACTORS[category]?.[type]?.value || 0;
      onLiveCo2Change(factor * numAmount);
    } else {
      onLiveCo2Change(0);
    }
  }, [debouncedAmount, category, type, onLiveCo2Change]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Rate Limiting
    const now = Date.now();
    if (now - lastSubmitTime.current < RATE_LIMIT_MS) {
      setError(`Please wait 3 seconds between submissions.`);
      return;
    }

    const numAmount = parseFloat(amount);
    if (amount.trim() === '' || isNaN(numAmount)) {
      setError('Please enter a valid number.');
      return;
    }
    if (numAmount < AMOUNT_MIN) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (numAmount > AMOUNT_MAX) {
      setError('Amount seems unrealistically high. Please verify.');
      return;
    }

    lastSubmitTime.current = now;
    addActivity({ category, type, amount: numAmount });
    trackEvent('activity_logged', { category, type, amount: numAmount });
    
    setAmount('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const selectedFactor = CARBON_FACTORS[category]?.[type];

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative">
      <h2 className="text-xl font-bold text-white mb-4 tracking-wide">Log Activity</h2>

      {error && (
        <div id={errorId} className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2" role="alert" aria-live="assertive">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="cat" className="text-sm font-semibold text-slate-400">Category</label>
        <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg border border-slate-700 bg-slate-800 text-white outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors">
          {Object.values(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="type" className="text-sm font-semibold text-slate-400">Activity Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}
          className="p-3 rounded-lg border border-slate-700 bg-slate-800 text-white outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors">
          {Object.entries(CARBON_FACTORS[category]).map(([key, data]) => (
            <option key={key} value={key}>{data.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label htmlFor="amount" className="text-sm font-semibold text-slate-400">
          Amount {selectedFactor && <span className="text-slate-500 font-normal">({selectedFactor.unit.split('/')[1]})</span>}
        </label>
        <input id="amount" type="number" step="any" min={AMOUNT_MIN} max={AMOUNT_MAX}
          value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 15"
          aria-required="true" aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? errorId : undefined}
          className="p-3 rounded-lg border border-slate-700 bg-slate-800 text-white outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors"
        />
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {success ? 'Activity successfully logged.' : ''}
      </div>

      <button type="submit"
        className={`w-full py-3 rounded-lg font-bold tracking-wider text-sm transition-all ${
          success ? 'bg-green-500 text-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-md'
        }`}>
        {success ? '✓ LOGGED' : 'ADD ACTIVITY'}
      </button>
    </form>
  );
};

CarbonForm.propTypes = {
  onLiveCo2Change: PropTypes.func.isRequired,
};

export default CarbonForm;
