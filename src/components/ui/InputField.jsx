import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic InputField component.
 */
export const InputField = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-semibold text-slate-400">{label}</label>}
      <input
        id={id}
        ref={ref}
        className={`p-3 rounded-lg border bg-slate-800 text-white outline-none transition-colors ${
          error ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                : 'border-slate-700 focus:border-green-400 focus:ring-1 focus:ring-green-400'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </div>
  );
});

InputField.displayName = 'InputField';

InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};
