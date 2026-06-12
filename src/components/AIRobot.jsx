import React, { useState, useEffect, useMemo } from 'react';

/**
 * AIRobot — Fully animated command-center robot character.
 * - Head scans left/right
 * - Arms breathe up/down
 * - Eyes glow green/amber/red based on footprint level
 * - Chest screen shows live CO₂ reading
 * - Antenna with pulsing signal rings
 * - Speech bubble with typewriter AI insight
 * - Processing animation on data submit
 */

const SPEECH = {
  green:  'SYSTEMS NOMINAL. PLANET TRAJECTORY: STABLE.',
  amber:  'WARNING: ELEVATED EMISSIONS DETECTED. OPTIMIZING...',
  red:    'CRITICAL ALERT: CARBON THRESHOLD EXCEEDED. INITIATING PROTOCOLS.',
};

const AIRobot = ({ co2Tons = 0, isProcessing = false }) => {
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const level = co2Tons <= 2 ? 'green' : co2Tons <= 4 ? 'amber' : 'red';
  const eyeColor = level === 'green' ? '#00FF87' : level === 'amber' ? '#FFB547' : '#FF4D6D';
  const fullText = SPEECH[level];

  // Typewriter effect
  useEffect(() => {
    setTypedText('');
    setCharIndex(0);
  }, [level]);

  useEffect(() => {
    if (charIndex < fullText.length) {
      const t = setTimeout(() => {
        setTypedText(prev => prev + fullText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(t);
    }
  }, [charIndex, fullText]);

  const robotStyle = `
    @keyframes headScan { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
    @keyframes armBreath { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    @keyframes signalPulse { 0% { r: 3; opacity: 0.8; } 100% { r: 18; opacity: 0; } }
    @keyframes eyeSpin { 0% { rx: 4; ry: 3; } 25% { rx: 2; ry: 2; } 50% { rx: 4; ry: 3; } 75% { rx: 5; ry: 2; } 100% { rx: 4; ry: 3; } }
    @keyframes chestFlicker { 0%,90%,100% { opacity: 1; } 92% { opacity: 0.3; } 95% { opacity: 0.8; } 97% { opacity: 0.4; } }
    .robot-head { animation: headScan 4s ease-in-out infinite; transform-origin: center bottom; }
    .robot-arm-l { animation: armBreath 3s ease-in-out infinite; }
    .robot-arm-r { animation: armBreath 3s ease-in-out infinite 0.5s; }
    .signal-ring { animation: signalPulse 2s ease-out infinite; }
    .signal-ring-2 { animation: signalPulse 2s ease-out infinite 0.6s; }
    .signal-ring-3 { animation: signalPulse 2s ease-out infinite 1.2s; }
    .processing .robot-eye { animation: eyeSpin 0.3s linear infinite; }
    .processing .chest-screen { animation: chestFlicker 0.5s linear infinite; }
  `;

  return (
    <div className={`relative flex-shrink-0 ${isProcessing ? 'processing' : ''}`}
      style={{ width: 100, height: 130 }} aria-hidden="true">
      <style>{robotStyle}</style>
      <svg viewBox="0 0 100 130" width="100" height="130" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ── Antenna ─────────────────────────────────── */}
        <line x1="50" y1="8" x2="50" y2="22" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="50" cy="6" r="3" fill={eyeColor}
          style={{ filter: `drop-shadow(0 0 6px ${eyeColor})` }}/>
        {/* Signal rings */}
        <circle cx="50" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="1" className="signal-ring" opacity="0"/>
        <circle cx="50" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="0.8" className="signal-ring-2" opacity="0"/>
        <circle cx="50" cy="6" r="3" fill="none" stroke={eyeColor} strokeWidth="0.6" className="signal-ring-3" opacity="0"/>

        {/* ── Head (scanning) ─────────────────────────── */}
        <g className="robot-head">
          <rect x="22" y="22" width="56" height="35" rx="8" fill="#0A1628" stroke="#00D4FF" strokeWidth="1.5"/>
          {/* Visor */}
          <rect x="28" y="28" width="44" height="18" rx="4" fill="#020917" stroke="#1A3A5C" strokeWidth="0.8"/>
          {/* Eyes */}
          <ellipse cx="38" cy="37" rx="4" ry="3" fill={eyeColor} className="robot-eye"
            style={{ filter: `drop-shadow(0 0 6px ${eyeColor}) drop-shadow(0 0 12px ${eyeColor})`,
                     transition: 'fill 0.5s' }}/>
          <ellipse cx="62" cy="37" rx="4" ry="3" fill={eyeColor} className="robot-eye"
            style={{ filter: `drop-shadow(0 0 6px ${eyeColor}) drop-shadow(0 0 12px ${eyeColor})`,
                     transition: 'fill 0.5s' }}/>
          {/* Pupils */}
          <circle cx="39" cy="37" r="1.5" fill="#020917"/>
          <circle cx="63" cy="37" r="1.5" fill="#020917"/>
          {/* Mouth */}
          <rect x="38" y="48" width="24" height="3" rx="1.5" fill="#1A3A5C"/>
          {[0,1,2,3,4].map(i => (
            <line key={i} x1={40+i*5} y1="48" x2={40+i*5} y2="51"
              stroke="#00D4FF" strokeWidth="1" opacity="0.5"/>
          ))}
        </g>

        {/* ── Body ────────────────────────────────────── */}
        <rect x="26" y="58" width="48" height="42" rx="6" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1.5"/>

        {/* Chest screen with CO₂ reading */}
        <g className="chest-screen">
          <rect x="32" y="63" width="36" height="18" rx="3" fill="#020917" stroke={eyeColor} strokeWidth="0.8"
            style={{ filter: `drop-shadow(0 0 4px ${eyeColor}40)` }}/>
          <text x="50" y="74" textAnchor="middle" fontSize="8" fontFamily="'Orbitron', sans-serif"
            fontWeight="900" fill={eyeColor} style={{ filter: `drop-shadow(0 0 3px ${eyeColor})` }}>
            {co2Tons.toFixed(2)}t
          </text>
          <text x="50" y="79" textAnchor="middle" fontSize="4" fontFamily="'JetBrains Mono', monospace"
            fill="#4A7A9B">CO₂/YR</text>
        </g>

        {/* Body details */}
        <circle cx="50" cy="90" r="4" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.4"/>
        <circle cx="50" cy="90" r="2" fill="#00D4FF" opacity="0.3"/>

        {/* ── Arms ────────────────────────────────────── */}
        <g className="robot-arm-l">
          <rect x="14" y="62" width="10" height="28" rx="5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
          <circle cx="19" cy="92" r="4" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
        </g>
        <g className="robot-arm-r">
          <rect x="76" y="62" width="10" height="28" rx="5" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
          <circle cx="81" cy="92" r="4" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
        </g>

        {/* ── Legs ────────────────────────────────────── */}
        <rect x="34" y="100" width="10" height="16" rx="4" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
        <rect x="56" y="100" width="10" height="16" rx="4" fill="#0A1628" stroke="#1A3A5C" strokeWidth="1"/>
        {/* Feet */}
        <rect x="30" y="114" width="18" height="6" rx="3" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8"/>
        <rect x="52" y="114" width="18" height="6" rx="3" fill="#0A1628" stroke="#00D4FF" strokeWidth="0.8"/>
      </svg>

      {/* ── Speech Bubble ─────────────────────────────── */}
      <div className="absolute -right-4 -top-2 w-52 pointer-events-none" style={{ transform: 'translateX(100%)' }}>
        <div className="relative rounded-xl p-3 text-left"
          style={{
            background: 'rgba(10,22,40,0.95)',
            border: `1px solid ${eyeColor}44`,
            boxShadow: `0 0 12px ${eyeColor}22`,
            fontSize: '0.6rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: eyeColor,
            lineHeight: 1.5,
            minHeight: 40,
          }}>
          {/* Tail */}
          <div className="absolute left-0 top-4 w-2 h-2 -translate-x-1/2 rotate-45"
            style={{ background: 'rgba(10,22,40,0.95)', borderLeft: `1px solid ${eyeColor}44`, borderBottom: `1px solid ${eyeColor}44` }}/>
          <span style={{ opacity: 0.5, fontSize: '0.5rem' }}>AI &gt; </span>
          {typedText}
          <span className="inline-block w-1 h-3 ml-0.5 align-middle" style={{ background: eyeColor, animation: 'blink 1s step-end infinite' }}/>
        </div>
      </div>
    </div>
  );
};

export default AIRobot;
