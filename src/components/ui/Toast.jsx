import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2 } from 'lucide-react';

/**
 * Notification Toast component.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
export const Toast = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-slide-up z-50" role="status" aria-live="polite">
      <CheckCircle2 size={18} />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};
