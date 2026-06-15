import React, { useState, useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, CARBON_FACTORS } from '../constants/carbonFactors';
import { useCarbon } from '../hooks/useCarbon';
import { trackEvent } from '../firebase';
import { Send, AlertCircle } from 'lucide-react';

const ActivityForm = ({ onTransmit }) => {
  const { addActivity } = useCarbon();
  const [category, setCategory] = useState(CATEGORIES.TRANSPORT);
  const [type, setType] = useState(Object.keys(CARBON_FACTORS[CATEGORIES.TRANSPORT])[0]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    if (amount.trim() === '' || isNaN(numAmount)) { setError('Please enter a valid number.'); return; }
    if (numAmount <= 0)    { setError('Amount must be greater than zero.'); return; }
    if (numAmount > 10000) { setError('Amount seems unrealistically high. Please verify.'); return; }

    addActivity({ category, type, amount: numAmount });
    trackEvent('activity_logged', { category, type, amount: numAmount });
    setAmount('');
    setSuccess(true);
    if (onTransmit) onTransmit();
    setTimeout(() => setSuccess(false), 2000);
  };

  const selectedFactor = CARBON_FACTORS[category]?.[type];

  const selectStyle = {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #1A3A5C',
    background: '#020917',
    color: '#e5e7eb',
    outline: 'none',
    width: '100%',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
  };

  const inputStyle = {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #1A3A5C',
    background: '#020917',
    color: '#e5e7eb',
    outline: 'none',
    width: '100%',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '1.125rem',
    transition: 'all 0.2s',
  };

  const focusStyle = { borderColor: '#00FF87', boxShadow: '0 0 0 1px #00FF87, 0 0 16px rgba(0,255,135,0.3)', background: 'rgba(0,255,135,0.04)' };

  const [focusedField, setFocusedField] = useState(null);

  return (
    <form onSubmit={handleSubmit} noValidate className="glass rounded-3xl relative overflow-hidden" style={{ padding: '28px 32px' }}>
      {/* Scanning line */}
      <div className="scan-line" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #00FF87, #00D4FF)' }} aria-hidden="true" />
        <h2 className="text-xl font-black font-orbitron tracking-wide" style={{ color: '#e5e7eb' }}>
          REPORT FIELD DATA
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div id={errorId} className="mb-5 p-4 rounded-xl flex items-start gap-3 border"
          style={{ background: 'rgba(255,77,109,0.08)', borderColor: 'rgba(255,77,109,0.3)', color: '#FF4D6D' }}
          role="alert" aria-live="assertive">
          <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span className="font-mono text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Category */}
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="activity-category" className="mono-label">Category</label>
        <select id="activity-category" value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ ...selectStyle, ...(focusedField === 'cat' ? focusStyle : {}) }}
          onFocus={() => setFocusedField('cat')} onBlur={() => setFocusedField(null)}
          aria-label="Select activity category">
          {Object.values(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Activity Type */}
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="activity-type" className="mono-label">Activity Type</label>
        <select id="activity-type" value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ ...selectStyle, ...(focusedField === 'type' ? focusStyle : {}) }}
          onFocus={() => setFocusedField('type')} onBlur={() => setFocusedField(null)}
          aria-label="Select activity type">
          {Object.entries(CARBON_FACTORS[category]).map(([key, data]) => (
            <option key={key} value={key}>{data.label}</option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-2 mb-6">
        <label htmlFor="activity-amount" className="mono-label">
          Amount {selectedFactor && <span style={{ color: '#4A7A9B', fontWeight: 400 }}>({selectedFactor.unit.split('/')[1]})</span>}
        </label>
        <input id="activity-amount" type="number" step="any" min="0.01" max="10000"
          value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 15"
          style={{ ...inputStyle, ...(focusedField === 'amt' ? focusStyle : {}) }}
          onFocus={() => setFocusedField('amt')} onBlur={() => setFocusedField(null)}
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {/* Success live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {success ? 'Activity successfully transmitted.' : ''}
      </div>

      {/* Submit */}
      <button type="submit"
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black font-orbitron tracking-widest text-sm transition-all"
        aria-label="Transmit carbon activity data"
        style={{
          background: success
            ? 'linear-gradient(135deg, #00FF87, #00D4FF)'
            : 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
          color: '#020917',
          boxShadow: success
            ? '0 0 32px rgba(0,255,135,0.7), 0 0 64px rgba(0,212,255,0.4)'
            : '0 0 20px rgba(0,255,135,0.4)',
        }}>
        <Send size={18} aria-hidden="true" />
        {success ? '✓ TRANSMITTED' : 'TRANSMIT DATA →'}
      </button>
    </form>
  );
};

ActivityForm.propTypes = {
  /** Optional callback fired after a valid activity is successfully submitted. */
  onTransmit: PropTypes.func,
};

ActivityForm.defaultProps = {
  onTransmit: null,
};

export default ActivityForm;
