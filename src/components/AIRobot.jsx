import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import {
  CO2_GREEN_MAX,
  CO2_AMBER_MAX,
  TYPEWRITER_DELAY_MS,
  ANTENNA_PULSE_MS,
} from '../constants/carbonFactors';

/**
 * AIRobot — Fully animated command-center robot character.
 *
 * - Head scans left/right on a 4-second cycle
 * - Arms breathe up/down independently (offset phase)
 * - Eyes glow green / amber / red based on CO₂ level
 * - Chest screen shows live CO₂ reading with flicker when processing
 * - Triple antenna signal rings pulse outward continuously
 * - Speech bubble with typewriter AI insight per level
 * - Entire body enters "processing" state on data submit
 *
 * @param {number} co2Tons - Projected annual CO₂ in metric tonnes
 * @param {boolean} isProcessing - True while a new activity is being submitted
 */

const SPEECH = {
  green: 'SYSTEMS NOMINAL. PLANET TRAJECTORY: STABLE.',
  amber: 'WARNING: ELEVATED EMISSIONS DETECTED. OPTIMIZING...',
  red:   'CRITICAL ALERT: CARBON THRESHOLD EXCEEDED. PROTOCOLS ACTIVE.',
};

/** Derive status level from projected annual CO₂ */
const getLevel = (tons) => {
  if (tons <= CO2_GREEN_MAX) return 'green';
  if (tons <= CO2_AMBER_MAX) return 'amber';
  return 'red';
};

/** Map level to glow colour */
const EYE_COLORS = {
  green: '#00FF87',
  amber: '#FFB547',
  red:   '#FF4D6D',
};

const ROBOT_STYLES = `
  @keyframes headScan {
    0%, 100% { transform: rotate(-3deg); }
    50%       { transform: rotate(3deg); }
  }
  @keyframes armBreath {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes signalPulse {
    0%   { r: 3; opacity: 0.8; }
    100% { r: 20; opacity: 0; }
  }
  @keyframes eyeSpin {
    0%   { rx: 4; ry: 3; }
    25%  { rx: 2; ry: 2; }
    50%  { rx: 4; ry: 3; }
    75%  { rx: 5; ry: 2; }
    100% { rx: 4; ry: 3; }
  }
  @keyframes chestFlicker {
    0%, 90%, 100% { opacity: 1; }
    92%  { opacity: 0.3; }
    95%  { opacity: 0.8; }
    97%  { opacity: 0.4; }
  }
  @keyframes robotFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes shoulderGlow {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.9; }
  }
  .robot-head     { animation: headScan 4s ease-in-out infinite; transform-origin: center bottom; }
  .robot-arm-l    { animation: armBreath 3s ease-in-out infinite; }
  .robot-arm-r    { animation: armBreath 3s ease-in-out 0.5s infinite; }
  .robot-body     { animation: robotFloat 6s ease-in-out infinite; }
  .signal-ring    { animation: signalPulse ${ANTENNA_PULSE_MS}ms ease-out infinite; }
  .signal-ring-2  { animation: signalPulse ${ANTENNA_PULSE_MS}ms ease-out 0.6s infinite; }
  .signal-ring-3  { animation: signalPulse ${ANTENNA_PULSE_MS}ms ease-out 1.2s infinite; }
  .shoulder-glow  { animation: shoulderGlow 2s ease-in-out infinite; }
  .processing .robot-eye    { animation: eyeSpin 0.3s linear infinite; }
  .processing .chest-screen { animation: chestFlicker 0.5s linear infinite; }
`;

const AIRobot = ({ co2Tons, isProcessing }) => {
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const level     = getLevel(co2Tons);
  const eyeColor  = EYE_COLORS[level];
  const fullText  = SPEECH[level];

  // Reset typewriter when the level changes
  useEffect(() => {
    setTypedText('');
    setCharIndex(0);
  }, [level]);

  // Advance one character at a time
  useEffect(() => {
    if (charIndex >= fullText.length) return;
    const timer = setTimeout(() => {
      setTypedText((prev) => prev + fullText[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, TYPEWRITER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [charIndex, fullText]);

  return (
    <div
      className={`relative flex-shrink-0 ${isProcessing ? 'processing' : ''}`}
      style={{ width: 110, height: 145 }}
      aria-hidden="true"
    >
      <style>{ROBOT_STYLES}</style>

      <svg viewBox="0 0 110 145" width="110" height="145" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ── Antenna ──────────────────────────────────────────── */}
        <line x1="55" y1="8" x2="55" y2="24" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="55" cy="6" r="3.5" fill={eyeColor} style={{ filter: `drop-shadow(0 0 8px ${eyeColor})` }}/>

        {/* Expanding signal rings */}
        <circle cx="55" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="1.2" className="signal-ring" opacity="0"/>
        <circle cx="55" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="0.8" className="signal-ring-2" opacity="0"/>
        <circle cx="55" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="0.5" className="signal-ring-3" opacity="0"/>

        {/* ── Entire body floats ────────────────────────────────── */}
        <g className="robot-body">

          {/* ── Head (scanning) ────────────────────────────────── */}
          <g className="robot-head">
            {/* Head shell */}
            <rect x="24" y="24" width="62" height="38" rx="10" fill="#0A1628" stroke="#00D4FF" strokeWidth="1.5"/>

            {/* Side ear-ports */}
            <rect x="17" y="32" width="7" height="14" rx="3" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
            <rect x="86" y="32" width="7" height="14" rx="3" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>

            {/* Visor panel */}
            <rect x="30" y="30" width="50" height="20" rx="5" fill="#020917" stroke="#1A3A5C" strokeWidth="0.8"/>

            {/* Eyes */}
            <ellipse cx="43" cy="40" rx="5" ry="4" fill={eyeColor} className="robot-eye"
              style={{ filter: `drop-shadow(0 0 8px ${eyeColor}) drop-shadow(0 0 16px ${eyeColor})`, transition: 'fill 0.5s' }}/>
            <ellipse cx="67" cy="40" rx="5" ry="4" fill={eyeColor} className="robot-eye"
              style={{ filter: `drop-shadow(0 0 8px ${eyeColor}) drop-shadow(0 0 16px ${eyeColor})`, transition: 'fill 0.5s' }}/>

            {/* Pupils */}
            <circle cx="44.5" cy="40" r="2" fill="#020917"/>
            <circle cx="68.5" cy="40" r="2" fill="#020917"/>

            {/* Inner eye glow rings */}
            <ellipse cx="43" cy="40" rx="3" ry="2.5" fill="none" stroke={eyeColor} strokeWidth="0.5" opacity="0.4"/>
            <ellipse cx="67" cy="40" rx="3" ry="2.5" fill="none" stroke={eyeColor} strokeWidth="0.5" opacity="0.4"/>

            {/* Mouth / speaker grill */}
            <rect x="40" y="52" width="30" height="4" rx="2" fill="#1A3A5C"/>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={42 + i * 5} y1="52" x2={42 + i * 5} y2="56"
                stroke="#00D4FF" strokeWidth="1" opacity="0.5"/>
            ))}
          </g>

          {/* ── Body ──────────────────────────────────────────── */}
          <rect x="28" y="63" width="54" height="46" rx="8" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1.5"/>

          {/* Shoulder glow accents */}
          <rect x="28" y="63" width="8" height="8" rx="2" fill={eyeColor} opacity="0.15" className="shoulder-glow"/>
          <rect x="74" y="63" width="8" height="8" rx="2" fill={eyeColor} opacity="0.15" className="shoulder-glow"
            style={{ animationDelay: '1s' }}/>

          {/* Chest screen */}
          <g className="chest-screen">
            <rect x="34" y="68" width="42" height="22" rx="4" fill="#020917" stroke={eyeColor} strokeWidth="0.8"
              style={{ filter: `drop-shadow(0 0 6px ${eyeColor}50)` }}/>

            {/* CO₂ value */}
            <text x="55" y="80" textAnchor="middle" fontSize="9" fontFamily="'Orbitron', sans-serif"
              fontWeight="900" fill={eyeColor} style={{ filter: `drop-shadow(0 0 4px ${eyeColor})` }}>
              {co2Tons.toFixed(2)}t
            </text>
            <text x="55" y="86" textAnchor="middle" fontSize="4.5" fontFamily="'JetBrains Mono', monospace"
              fill="#4A7A9B">CO₂ / YR</text>
          </g>

          {/* Body detail — reactor core indicator */}
          <circle cx="55" cy="100" r="5" fill="none" stroke={eyeColor} strokeWidth="1" opacity="0.4"/>
          <circle cx="55" cy="100" r="2.5" fill={eyeColor} opacity="0.25"/>
          <circle cx="55" cy="100" r="1" fill={eyeColor} opacity="0.7"/>

          {/* Side vents */}
          {[0, 1, 2].map((i) => (
            <rect key={i} x="30" y={70 + i * 5} width="4" height="2" rx="1" fill="#00D4FF" opacity="0.2"/>
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={i} x="76" y={70 + i * 5} width="4" height="2" rx="1" fill="#00D4FF" opacity="0.2"/>
          ))}

          {/* ── Arms ──────────────────────────────────────────── */}
          <g className="robot-arm-l">
            <rect x="14" y="66" width="12" height="32" rx="6" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
            {/* Hand */}
            <rect x="12" y="95" width="16" height="8" rx="4" fill="#0A1628" stroke={eyeColor} strokeWidth="0.8" opacity="0.6"/>
          </g>
          <g className="robot-arm-r">
            <rect x="84" y="66" width="12" height="32" rx="6" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
            {/* Hand */}
            <rect x="82" y="95" width="16" height="8" rx="4" fill="#0A1628" stroke={eyeColor} strokeWidth="0.8" opacity="0.6"/>
          </g>

          {/* ── Legs ──────────────────────────────────────────── */}
          <rect x="36" y="109" width="14" height="20" rx="5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
          <rect x="60" y="109" width="14" height="20" rx="5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
          {/* Feet */}
          <rect x="32" y="126" width="22" height="8" rx="4" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8"/>
          <rect x="56" y="126" width="22" height="8" rx="4" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8"/>
          {/* Foot thrusters */}
          <rect x="36" y="132" width="6" height="2" rx="1" fill={eyeColor} opacity="0.4"/>
          <rect x="60" y="132" width="6" height="2" rx="1" fill={eyeColor} opacity="0.4"/>
        </g>
      </svg>

      {/* ── Speech Bubble ─────────────────────────────────────── */}
      <div className="absolute pointer-events-none" style={{ right: -8, top: -4, transform: 'translateX(100%)', width: 220 }}>
        <div className="relative rounded-xl p-3" style={{
          background: 'rgba(10,22,40,0.97)',
          border: `1px solid ${eyeColor}55`,
          boxShadow: `0 0 16px ${eyeColor}25, inset 0 0 12px rgba(0,0,0,0.5)`,
          fontSize: '0.62rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: eyeColor,
          lineHeight: 1.6,
          minHeight: 48,
        }}>
          {/* Arrow tail */}
          <div className="absolute" style={{
            left: 0, top: 14, width: 8, height: 8,
            transform: 'translateX(-50%) rotate(45deg)',
            background: 'rgba(10,22,40,0.97)',
            borderLeft: `1px solid ${eyeColor}55`,
            borderBottom: `1px solid ${eyeColor}55`,
          }}/>
          {/* Header row */}
          <div className="flex items-center gap-1.5 mb-1.5" style={{ opacity: 0.6 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: eyeColor, boxShadow: `0 0 4px ${eyeColor}` }}/>
            <span style={{ fontSize: '0.5rem', letterSpacing: '0.15em' }}>CARBON-BOT v2.1 &gt;&gt;</span>
          </div>
          {typedText}
          <span className="inline-block w-1.5 h-3 ml-0.5 align-middle" style={{
            background: eyeColor,
            animation: 'blink 1s step-end infinite',
          }}/>
        </div>
      </div>
    </div>
  );
};

AIRobot.propTypes = {
  /** Projected annual CO₂ in metric tonnes — controls robot eye colour and speech. */
  co2Tons: PropTypes.number,
  /** When true, eyes spin and chest screen flickers to indicate processing. */
  isProcessing: PropTypes.bool,
};

AIRobot.defaultProps = {
  co2Tons: 0,
  isProcessing: false,
};

export default memo(AIRobot);
