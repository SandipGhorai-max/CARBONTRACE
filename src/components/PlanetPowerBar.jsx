import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Zap } from 'lucide-react';
import { GLOBAL_AVERAGE_TONS } from '../constants/carbonFactors';

/**
 * PlanetPowerBar — a horizontal battery/recharge bar that fills based on
 * how far below the global average the user's footprint is.
 * Shows SYSTEM FULLY CHARGED badge when footprint is 80%+ below average.
 */
const PlanetPowerBar = ({ projectedTons }) => {
  const safeTons = isNaN(projectedTons) || projectedTons == null ? 0 : projectedTons;
  const barRef   = useRef(null);
  const [animated, setAnimated] = useState(false);

  // Power = how much BELOW global average, clamped 0-100
  // 0 tons = 100% power (perfect); at global average = 0% power
  const rawPower = Math.max(0, ((GLOBAL_AVERAGE_TONS - safeTons) / GLOBAL_AVERAGE_TONS) * 100);
  const power    = Math.min(Math.round(rawPower), 100);
  const isCharged = power >= 80;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const barColor = power >= 80
    ? 'linear-gradient(90deg, #00FF87, #00D4FF)'
    : power >= 40
    ? 'linear-gradient(90deg, #FFB547, #00FF87)'
    : 'linear-gradient(90deg, #FF4D6D, #FFB547)';

  const glowColor = power >= 80
    ? 'rgba(0,255,135,0.5)'
    : power >= 40
    ? 'rgba(255,181,71,0.5)'
    : 'rgba(255,77,109,0.5)';

  return (
    <div className="glass rounded-2xl p-5"
      style={{ borderColor: power >= 80 ? '#00FF87' : power >= 40 ? '#FFB547' : '#FF4D6D',
               boxShadow: `0 0 16px ${glowColor}, inset 0 0 16px ${glowColor.replace('0.5','0.03')}` }}
      role="region" aria-label={`Planet power level: ${power}%`}>

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={18} aria-hidden="true" style={{ color: power >= 80 ? '#00FF87' : power >= 40 ? '#FFB547' : '#FF4D6D' }}/>
          <span className="mono-label tracking-widest" style={{ color: power >= 80 ? '#00FF87' : power >= 40 ? '#FFB547' : '#FF4D6D' }}>
            PLANET POWER LEVEL
          </span>
        </div>
        <span className="font-orbitron font-black text-base" style={{
          color: power >= 80 ? '#00FF87' : power >= 40 ? '#FFB547' : '#FF4D6D',
          textShadow: `0 0 10px ${glowColor}`,
        }}>
          {power}%
        </span>
      </div>

      {/* Battery bar */}
      <div className="relative w-full h-5 rounded-full overflow-hidden"
        style={{ background: 'rgba(10,22,40,0.9)', border: '1px solid #1A3A5C' }}
        role="progressbar" aria-valuenow={power} aria-valuemin={0} aria-valuemax={100}
        aria-label={`${power}% planet power`}>

        {/* Fill */}
        <div ref={barRef} className="h-full rounded-full relative overflow-hidden"
          style={{
            width: animated ? `${power}%` : '0%',
            background: barColor,
            boxShadow: `0 0 12px ${glowColor}`,
            transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
          {/* Shimmer effect */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s linear infinite',
          }} aria-hidden="true" />
        </div>

        {/* Battery notches */}
        {[25, 50, 75].map(mark => (
          <div key={mark} className="absolute top-0 bottom-0 w-px" aria-hidden="true"
            style={{ left: `${mark}%`, background: '#020917', opacity: 0.7 }} />
        ))}
      </div>

      {/* Charged badge OR status text */}
      <div className="mt-3 flex items-center justify-between">
        {isCharged ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs font-bold"
            style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.4)', color: '#00FF87' }}>
            <Zap size={12} aria-hidden="true" />
            SYSTEM FULLY CHARGED ⚡
          </div>
        ) : (
          <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {power < 40
              ? 'HIGH EMISSIONS DETECTED — TAKE ACTION'
              : 'POWER BUILDING — KEEP REDUCING FOOTPRINT'}
          </span>
        )}
        <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {safeTons > 0 ? `${safeTons.toFixed(2)}t / ${GLOBAL_AVERAGE_TONS}t AVG` : 'NO DATA'}
        </span>
      </div>
    </div>
  );
};

PlanetPowerBar.propTypes = { projectedTons: PropTypes.number.isRequired };
export default memo(PlanetPowerBar);
