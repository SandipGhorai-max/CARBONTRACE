import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CO2_GREEN_MAX, CO2_AMBER_MAX } from '../constants/carbonFactors';

/**
 * MiniRobot — A single small ambient robot with breathing animation.
 * Used purely as decorative background chrome.
 * aria-hidden on the parent container ensures screen readers ignore them.
 *
 * @param {string} color - Stroke and glow colour
 * @param {number} delay - CSS animation delay in seconds
 * @param {number} size - SVG size in px
 */
const MINI_ROBOT_STYLES = `
  @keyframes miniFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-5px) rotate(-1deg); }
    66%       { transform: translateY(-2px) rotate(1deg); }
  }
  @keyframes miniEyeFlash {
    0%, 88%, 100% { opacity: 1; }
    90%           { opacity: 0.1; }
    94%           { opacity: 0.8; }
  }
  @keyframes miniScan {
    0%, 100% { transform: scaleX(0.2); }
    50%       { transform: scaleX(1); }
  }
`;

const MiniRobot = ({ color, delayS, size }) => (
  <svg viewBox="0 0 40 55" width={size} height={size * 1.375} fill="none"
    style={{
      animation: `miniFloat 5s ease-in-out ${delayS}s infinite`,
      filter: `drop-shadow(0 0 6px ${color}40)`,
    }}>

    {/* Antenna */}
    <line x1="20" y1="2" x2="20" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="1.5" r="1.5" fill={color} style={{ animation: `miniEyeFlash 3s ease-in-out ${delayS}s infinite` }}/>

    {/* Head */}
    <rect x="9" y="10" width="22" height="15" rx="4" fill="#0A1628" stroke={color} strokeWidth="1"/>
    {/* Eyes */}
    <ellipse cx="15" cy="17" rx="2.5" ry="2" fill={color}
      style={{ filter: `drop-shadow(0 0 4px ${color})`, animation: `miniEyeFlash 3s ease-in-out ${delayS + 0.2}s infinite` }}/>
    <ellipse cx="25" cy="17" rx="2.5" ry="2" fill={color}
      style={{ filter: `drop-shadow(0 0 4px ${color})`, animation: `miniEyeFlash 3s ease-in-out ${delayS + 0.4}s infinite` }}/>

    {/* Body */}
    <rect x="11" y="26" width="18" height="16" rx="3" fill="#0A1628" stroke="#1A3A5C" strokeWidth="0.8"/>
    {/* Scan line on chest */}
    <rect x="13" y="31" width="14" height="1.5" rx="0.75" fill={color} opacity="0.3"
      style={{ transformOrigin: 'left center', animation: `miniScan 2s ease-in-out ${delayS}s infinite` }}/>
    <rect x="13" y="35" width="14" height="1" rx="0.5" fill={color} opacity="0.15"/>

    {/* Arms */}
    <rect x="4" y="27" width="6" height="11" rx="3" fill="#0A1628" stroke="#1A3A5C" strokeWidth="0.8"/>
    <rect x="30" y="27" width="6" height="11" rx="3" fill="#0A1628" stroke="#1A3A5C" strokeWidth="0.8"/>

    {/* Legs */}
    <rect x="13" y="42" width="5" height="8" rx="2.5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="0.8"/>
    <rect x="22" y="42" width="5" height="8" rx="2.5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="0.8"/>
    {/* Feet */}
    <rect x="11" y="48" width="9" height="4" rx="2" fill="#0A1628" stroke={color} strokeWidth="0.6" opacity="0.7"/>
    <rect x="20" y="48" width="9" height="4" rx="2" fill="#0A1628" stroke={color} strokeWidth="0.6" opacity="0.7"/>
  </svg>
);

MiniRobot.propTypes = {
  /** Colour used for all glowing elements */
  color: PropTypes.string.isRequired,
  /** CSS animation delay in seconds for phase-offsetting the float */
  delayS: PropTypes.number,
  /** Width of the SVG in pixels (height is auto-scaled 1.375×) */
  size: PropTypes.number,
};

MiniRobot.defaultProps = {
  delayS: 0,
  size: 36,
};

/**
 * RobotFleet — A decorative panel showing three ambient mini-robots
 * that respond to the current CO₂ level via colour changes.
 *
 * aria-hidden on the outer div ensures this is purely cosmetic for AT users.
 *
 * @param {number} co2Tons - Projected annual CO₂ in metric tonnes
 */
const RobotFleet = ({ co2Tons }) => {
  const isGreen = co2Tons <= CO2_GREEN_MAX;
  const isRed   = co2Tons > CO2_AMBER_MAX;

  const colors = isGreen
    ? ['#00FF87', '#00D4FF', '#00FF87']
    : isRed
    ? ['#FF4D6D', '#FFB547', '#FF4D6D']
    : ['#FFB547', '#00D4FF', '#FFB547'];

  const statusLabel = isGreen ? 'ALL UNITS NOMINAL' : isRed ? 'CRITICAL — UNITS ON ALERT' : 'ELEVATED — UNITS MONITORING';
  const statusColor = isGreen ? '#00FF87' : isRed ? '#FF4D6D' : '#FFB547';

  return (
    <div className="glass rounded-2xl p-4" aria-hidden="true"
      style={{ borderColor: `${statusColor}33`, boxShadow: `0 0 16px ${statusColor}18` }}>
      <style>{MINI_ROBOT_STYLES}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, animation: 'pulse 1.5s ease-in-out infinite' }}/>
          <span className="font-orbitron font-black" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: statusColor }}>
            ROBOT FLEET
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '0.5rem', color: `${statusColor}88`, letterSpacing: '0.1em' }}>
          {statusLabel}
        </span>
      </div>

      {/* Robot trio */}
      <div className="flex items-end justify-around gap-2">
        {colors.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <MiniRobot color={color} delayS={i * 1.2} size={i === 1 ? 42 : 32}/>
            <span className="font-mono" style={{ fontSize: '0.45rem', color: `${color}88`, letterSpacing: '0.1em' }}>
              BOT-0{i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="mt-3 flex gap-1">
        {['CPU', 'NET', 'ENV'].map((label, i) => (
          <div key={label} className="flex-1">
            <div className="font-mono mb-1" style={{ fontSize: '0.45rem', color: '#4A7A9B', letterSpacing: '0.08em' }}>{label}</div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1A3A5C' }}>
              <div className="h-full rounded-full" style={{
                background: `linear-gradient(90deg, transparent, ${colors[i % colors.length]})`,
                backgroundSize: '200% 100%',
                animation: `shimmer ${1.5 + i * 0.5}s linear infinite`,
                width: `${60 + i * 15}%`,
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

RobotFleet.propTypes = {
  /** Projected annual CO₂ in metric tonnes — drives fleet colour and alert status. */
  co2Tons: PropTypes.number,
};

RobotFleet.defaultProps = {
  co2Tons: 0,
};

export default memo(RobotFleet);
