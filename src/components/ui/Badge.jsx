import React from 'react';
import PropTypes from 'prop-types';
import { LEVEL_STYLES } from '../../constants';

/**
 * Atomic Badge component for displaying carbon levels.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
export const Badge = ({ level, children, className = '' }) => {
  const styles = LEVEL_STYLES[level] || LEVEL_STYLES.green;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles.border} ${styles.text} ${className}`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${styles.bg}`} aria-hidden="true" />
      {children}
    </div>
  );
};

Badge.propTypes = {
  level: PropTypes.oneOf(['green', 'amber', 'red']).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
