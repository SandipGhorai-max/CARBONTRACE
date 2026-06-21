import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic Button component.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-400 text-slate-900 focus:ring-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 hover:border-red-400 focus:ring-red-400',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'danger', 'ghost']),
  className: PropTypes.string,
};
