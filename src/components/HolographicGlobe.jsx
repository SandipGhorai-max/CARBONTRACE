import React, { memo } from 'react';

/**
 * HolographicGlobe — A rotating Earth wireframe in the top-right corner.
 * Built entirely with CSS/SVG. Glows green when footprint is good, red when bad.
 */
const HolographicGlobe = ({ co2Tons = 0 }) => {
  const color = co2Tons <= 2 ? '#00FF87' : co2Tons <= 4 ? '#FFB547' : '#FF4D6D';

  return (
    <div className="relative" style={{ width: 56, height: 56 }} aria-hidden="true">
      <svg viewBox="0 0 56 56" width="56" height="56" className="animate-tick-rotate"
        style={{ animationDuration: '30s', filter: `drop-shadow(0 0 8px ${color}66)` }}>
        {/* Outer ring */}
        <circle cx="28" cy="28" r="25" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6"/>
        {/* Meridians */}
        <ellipse cx="28" cy="28" rx="12" ry="25" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4"/>
        <ellipse cx="28" cy="28" rx="20" ry="25" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        {/* Parallels */}
        <ellipse cx="28" cy="16" rx="22" ry="4" fill="none" stroke={color} strokeWidth="0.4" opacity="0.3"/>
        <ellipse cx="28" cy="28" rx="25" ry="5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"/>
        <ellipse cx="28" cy="40" rx="22" ry="4" fill="none" stroke={color} strokeWidth="0.4" opacity="0.3"/>
        {/* Axis */}
        <line x1="28" y1="2" x2="28" y2="54" stroke={color} strokeWidth="0.3" opacity="0.2"/>
        {/* Center glow */}
        <circle cx="28" cy="28" r="3" fill={color} opacity="0.15"/>
      </svg>
      {/* Pulsing aura */}
      <div className="absolute inset-0 rounded-full animate-pulse-slow"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }}/>
    </div>
  );
};

export default memo(HolographicGlobe);
