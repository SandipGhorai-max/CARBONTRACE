import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../utils/formatters';
import { GLOBAL_AVERAGE_TONS, PARIS_AGREEMENT_TONS } from '../constants/carbonFactors';

/* Tick marks ring around the gauge */
const TickRing = ({ radius, count = 48 }) => {
  const ticks = Array.from({ length: count }, (_, i) => {
    const angle   = (i / count) * 360;
    const isLong  = i % 8 === 0;
    const radians = (angle - 90) * (Math.PI / 180);
    const inner   = radius - (isLong ? 12 : 7);
    const outer   = radius;
    const x1 = 110 + inner * Math.cos(radians);
    const y1 = 110 + inner * Math.sin(radians);
    const x2 = 110 + outer * Math.cos(radians);
    const y2 = 110 + outer * Math.sin(radians);
    return { x1, y1, x2, y2, isLong };
  });

  return (
    <>
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isLong ? '#00D4FF' : '#1A3A5C'}
          strokeWidth={t.isLong ? 1.5 : 0.8}
          strokeLinecap="round"
          opacity={t.isLong ? 0.8 : 0.4}
        />
      ))}
    </>
  );
};

const PlanetGauge = ({ projectedTons }) => {
  const [animatedPct, setAnimatedPct] = useState(0);
  const safeTons = isNaN(projectedTons) || projectedTons == null ? 0 : projectedTons;

  const maxScale       = Math.max(GLOBAL_AVERAGE_TONS * 1.5, safeTons * 1.2, 6);
  const targetPct      = Math.min((safeTons / maxScale) * 100, 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(targetPct), 200);
    return () => clearTimeout(t);
  }, [targetPct]);

  // Color thresholds
  let color = '#00FF87', shadowColor = 'rgba(0,255,135,0.6)';
  let statusText = 'ON TRACK — PARIS TARGET';
  if (safeTons > PARIS_AGREEMENT_TONS && safeTons <= GLOBAL_AVERAGE_TONS) {
    color = '#FFB547'; shadowColor = 'rgba(255,181,71,0.6)';
    statusText = 'BELOW GLOBAL AVERAGE';
  } else if (safeTons > GLOBAL_AVERAGE_TONS) {
    color = '#FF4D6D'; shadowColor = 'rgba(255,77,109,0.6)';
    statusText = 'ABOVE GLOBAL AVERAGE';
  }

  const ariaLabel = `Reactor core: ${formatNumber(safeTons)} tonnes CO2 per year. ${statusText}`;

  // SVG math
  const outerR = 108, gaugeR = 88, circumference = 2 * Math.PI * gaugeR;
  const dashOffset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-center w-full"
      style={{ borderColor: color, boxShadow: `0 0 30px ${shadowColor}, inset 0 0 30px ${shadowColor.replace('0.6','0.04')}` }}>

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="font-orbitron font-black text-sm tracking-widest" style={{ color }}>
          ⚛ REACTOR CORE
        </h2>
        <span className="mono-label" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
          STATUS: {statusText}
        </span>
      </div>

      {/* SVG Gauge */}
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

        {/* Outer rotating ring */}
        <div className="absolute inset-0 animate-tick-rotate" aria-hidden="true"
          style={{ animationDuration: '20s' }}>
          <svg viewBox="0 0 220 220" width="280" height="280">
            <TickRing radius={outerR} count={60} />
          </svg>
        </div>

        {/* Counter-rotating inner ring */}
        <div className="absolute inset-0 animate-orbit-reverse" aria-hidden="true">
          <svg viewBox="0 0 220 220" width="280" height="280">
            <circle cx="110" cy="110" r={outerR - 14}
              stroke="#00D4FF" strokeWidth="0.5" fill="none" strokeDasharray="4 8" opacity="0.3" />
          </svg>
        </div>

        {/* Main gauge SVG */}
        <svg viewBox="0 0 220 220" width="240" height="240"
          className="absolute" style={{ animation: 'gaugeGlow 3s ease-in-out infinite' }}
          role="img" aria-label={ariaLabel} focusable="false">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color === '#00FF87' ? '#00D4FF' : color} stopOpacity="1" />
            </linearGradient>
            <filter id="gaugeBlur">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle cx="110" cy="110" r={gaugeR}
            stroke="#0A1628" strokeWidth="14" fill="none" />

          {/* Subtle glow track */}
          <circle cx="110" cy="110" r={gaugeR}
            stroke={color} strokeWidth="14" fill="none" opacity="0.06" />

          {/* Value arc */}
          <circle cx="110" cy="110" r={gaugeR}
            stroke={`url(#gaugeGrad)`} strokeWidth="14" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            filter="url(#gaugeBlur)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center text-center z-10"
          tabIndex={0} aria-label={ariaLabel}
          style={{ outline: 'none' }}
          onFocus={(e) => e.currentTarget.style.outline = `2px solid ${color}`}
          onBlur={(e)  => e.currentTarget.style.outline = 'none'}>
          <span className="font-orbitron font-black" style={{
            fontSize: '3.5rem', lineHeight: 1,
            color, textShadow: `0 0 20px ${color}, 0 0 40px ${shadowColor}`,
          }}>
            {formatNumber(safeTons)}
          </span>
          <span className="font-mono text-xs mt-2 tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            CO₂ TONS / YEAR DETECTED
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 w-full flex justify-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }} aria-hidden="true" />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Paris: <strong style={{ color: '#00FF87' }}>{PARIS_AGREEMENT_TONS}t</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#FFB547', boxShadow: '0 0 6px #FFB547' }} aria-hidden="true" />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Global Avg: <strong style={{ color: '#FFB547' }}>{GLOBAL_AVERAGE_TONS}t</strong></span>
        </div>
      </div>
    </div>
  );
};

PlanetGauge.propTypes = { projectedTons: PropTypes.number.isRequired };
export default memo(PlanetGauge);
