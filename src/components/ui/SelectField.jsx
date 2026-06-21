import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic SelectField component.
 */
export const SelectField = forwardRef(({ label, id, options, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-semibold text-slate-400">{label}</label>}
      <select
        id={id}
        ref={ref}
        className="p-3 rounded-lg border border-slate-700 bg-slate-800 text-white outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

SelectField.displayName = 'SelectField';

SelectField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};
