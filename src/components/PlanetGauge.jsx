import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../utils/formatters';
import { GLOBAL_AVERAGE_TONS, PARIS_AGREEMENT_TONS } from '../constants/carbonFactors';

const PlanetGauge = ({ projectedTons }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Ensure projectedTons is a valid number
  const safeTons = isNaN(projectedTons) || projectedTons === null ? 0 : projectedTons;

  // Determine scale, ensuring it accommodates higher values
  const maxScale = Math.max(GLOBAL_AVERAGE_TONS * 1.5, safeTons * 1.2, 6);
  const targetPercentage = Math.min((safeTons / maxScale) * 100, 100);

  // Trigger animation on mount or when tons change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(targetPercentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [targetPercentage]);

  // Determine status text and color based on threshold
  let statusText = '';
  let colorClass = 'text-electric drop-shadow-[0_0_15px_rgba(0,255,135,0.8)]';
  let strokeColor = '#00FF87';

  if (safeTons <= PARIS_AGREEMENT_TONS) {
    statusText = 'On track for Paris Agreement target.';
    colorClass = 'text-electric drop-shadow-[0_0_15px_rgba(0,255,135,0.8)]';
    strokeColor = '#00FF87';
  } else if (safeTons <= GLOBAL_AVERAGE_TONS) {
    statusText = 'Below global average — good progress!';
    colorClass = 'text-amber drop-shadow-[0_0_15px_rgba(255,181,71,0.8)]';
    strokeColor = '#FFB547';
  } else {
    statusText = 'Above global average — consider taking action.';
    colorClass = 'text-coral drop-shadow-[0_0_15px_rgba(255,77,109,0.8)]';
    strokeColor = '#FF4D6D';
  }

  const ariaLabel = `Your projected annual footprint is ${formatNumber(safeTons)} tonnes of CO2. ${statusText}`;

  // SVG gauge mathematics
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div
      className="flex flex-col items-center justify-center p-8 glass rounded-3xl w-full hover:shadow-neon hover:border-cyan transition-all duration-300"
      role="region"
      aria-label="Carbon Footprint Gauge"
    >
      {/* Heading for the gauge section */}
      <h2 className="text-sm font-bold font-orbitron text-gray-400 uppercase tracking-widest mb-4">
        Annual Projection
      </h2>

      <div
        className="relative flex items-center justify-center w-64 h-64 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan rounded-full"
        aria-label={ariaLabel}
        role="img"
        tabIndex={0}
      >
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
          aria-hidden="true"
          focusable="false"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#1F2937"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Value Track — animated */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={`url(#gaugeGradient)`}
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)', filter: `drop-shadow(0 0 8px ${strokeColor}88)` }}
          />
        </svg>

        {/* Inner Text overlay */}
        <div className="absolute flex flex-col items-center justify-center text-center" aria-hidden="true">
          <span className={`text-5xl font-orbitron font-black tracking-tight ${colorClass.split(' ')[0]}`}>
            {formatNumber(safeTons)}
          </span>
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-2 font-inter">
            Tons / Year
          </span>
        </div>
      </div>

      {/* Status message */}
      <p className={`mt-4 text-xs font-semibold text-center font-inter ${colorClass.split(' ')[0]}`} aria-hidden="true">
        {statusText}
      </p>

      {/* Legend for context */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm w-full justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-electric shadow-neon-green" aria-hidden="true"></span>
          <span className="text-gray-300 font-medium font-inter">
            Paris Target: <strong>{PARIS_AGREEMENT_TONS}t</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber shadow-[0_0_10px_rgba(255,181,71,0.5)]" aria-hidden="true"></span>
          <span className="text-gray-300 font-medium font-inter">
            Global Avg: <strong>{GLOBAL_AVERAGE_TONS}t</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

PlanetGauge.propTypes = {
  projectedTons: PropTypes.number.isRequired,
};

// Memoize to prevent re-renders when parent state changes unrelated to projectedTons
export default memo(PlanetGauge);
