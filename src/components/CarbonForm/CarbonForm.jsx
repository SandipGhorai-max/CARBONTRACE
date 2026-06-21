import React, { useState, useEffect, useId, useRef, useCallback } from 'react';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { Toast } from '../ui/Toast';
import { useCarbon } from '../../hooks/useCarbon';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { trackEvent } from '../../services/firebase.analytics';
import { CATEGORIES, CARBON_FACTORS, VALIDATION, TIMINGS, ANALYTICS_EVENTS } from '../../constants';
import { CarbonFormProps } from '../../types/propTypes';

/**
 * CarbonForm component.
 * Allows users to log new carbon activities.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
export const CarbonForm = ({ onLiveCo2Change }) => {
  const { addActivity } = useCarbon();
  const { playBeep, playAlert, playSuccess } = useSoundEngine();
  
  const [category, setCategory] = useState(CATEGORIES.TRANSPORT);
  const [type, setType] = useState(Object.keys(CARBON_FACTORS[CATEGORIES.TRANSPORT])[0]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const errorId = useId();
  const lastSubmitTime = useRef(0);

  const getUnit = useCallback(() => CARBON_FACTORS[category]?.[type]?.label || 'Amount', [category, type]);

  useEffect(() => {
    const defaultType = Object.keys(CARBON_FACTORS[category])[0];
    setType(defaultType);
  }, [category]);

  const handleCategoryChange = useCallback((e) => {
    playBeep();
    setCategory(e.target.value);
  }, [playBeep]);

  const handleTypeChange = useCallback((e) => {
    playBeep();
    setType(e.target.value);
  }, [playBeep]);

  const handleAmountChange = useCallback((e) => {
    setAmount(e.target.value);
    const num = parseFloat(e.target.value);
    const co2 = (num && num > 0) ? num * CARBON_FACTORS[category]?.[type]?.value : 0;
    onLiveCo2Change(co2);
  }, [category, type, onLiveCo2Change]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const now = Date.now();
    
    if (now - lastSubmitTime.current < TIMINGS.RATE_LIMIT_WINDOW) {
      setError('Please wait a moment before submitting again');
      playAlert();
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < VALIDATION.AMOUNT_MIN) {
      setError(`Amount must be at least ${VALIDATION.AMOUNT_MIN}`);
      playAlert();
      return;
    }
    if (numAmount > VALIDATION.AMOUNT_MAX) {
      setError(`Amount cannot exceed ${VALIDATION.AMOUNT_MAX}`);
      playAlert();
      return;
    }

    addActivity({ category, type, amount: numAmount });
    trackEvent(ANALYTICS_EVENTS.ACTIVITY_LOGGED, { category, type, amount: numAmount });
    
    lastSubmitTime.current = now;
    setAmount('');
    setError('');
    setSuccess(true);
    onLiveCo2Change(0);
    playSuccess();

    setTimeout(() => setSuccess(false), TIMINGS.SUCCESS_DISPLAY_MS);
  }, [amount, category, type, addActivity, playAlert, playSuccess, onLiveCo2Change]);

  const categoryOptions = Object.values(CATEGORIES).map(cat => ({ value: cat, label: cat }));
  const typeOptions = Object.entries(CARBON_FACTORS[category] || {}).map(([key, data]) => ({ value: key, label: data.label }));

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative">
      <Toast show={success} message="Activity logged to sequence" />
      <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-slate-800 pb-2">Log Activity</h2>

      {error && (
        <div id={errorId} className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2" role="alert" aria-live="assertive">
          <span className="text-xl" aria-hidden="true">⚠️</span>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <SelectField label="Category" id="cat" value={category} onChange={handleCategoryChange} options={categoryOptions} />
        <SelectField label="Activity Type" id="type" value={type} onChange={handleTypeChange} options={typeOptions} />
        <InputField label={getUnit()} id="amount" type="number" step="any" min={VALIDATION.AMOUNT_MIN} max={VALIDATION.AMOUNT_MAX} value={amount} onChange={handleAmountChange} placeholder="Enter value..." error={error} required />
        <Button type="submit" variant="primary" className="mt-2">Commit Entry</Button>
      </div>
    </form>
  );
};

CarbonForm.propTypes = CarbonFormProps;
