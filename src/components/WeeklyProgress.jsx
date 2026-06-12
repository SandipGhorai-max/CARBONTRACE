import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Flame, TrendingDown, TrendingUp } from 'lucide-react';
import { GLOBAL_AVERAGE_TONS } from '../constants/carbonFactors';
import { formatNumber } from '../utils/formatters';

/* Animated count-up number */
const CountUp = ({ target, duration = 1200 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span ref={ref}>0</span>;
};

const WeeklyProgress = ({ streak, projectedTons }) => {
  const safeTons   = isNaN(projectedTons) || projectedTons == null ? 0 : projectedTons;
  const safeStreak = isNaN(streak)        || streak == null        ? 0 : streak;

  const difference  = safeTons - GLOBAL_AVERAGE_TONS;
  const percentDiff = Math.abs((difference / GLOBAL_AVERAGE_TONS) * 100);
  const isBelow     = difference <= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="region" aria-label="Mission progress summary">

      {/* ── MISSION STREAK ─────────────────────────────────────────── */}
      <div
        className="glass rounded-2xl p-6 flex items-center gap-5 group transition-all duration-300 cursor-default"
        style={{ borderColor: '#FFB547', boxShadow: '0 0 20px rgba(255,181,71,0.25), inset 0 0 20px rgba(255,181,71,0.04)' }}
        aria-label={`Mission streak: ${safeStreak} ${safeStreak === 1 ? 'day' : 'days'}`}
      >
        {/* Scan line */}
        <div className="scan-line" aria-hidden="true" />

        <div className="p-3 rounded-xl shrink-0"
          style={{ background: 'rgba(255,181,71,0.1)', border: '1px solid rgba(255,181,71,0.3)' }}>
          <Flame size={28} aria-hidden="true" style={{ color: '#FFB547', filter: 'drop-shadow(0 0 8px #FFB547)' }} />
        </div>

        <div className="flex flex-col">
          <span className="mono-label" style={{ color: '#FFB547', opacity: 0.8 }}>MISSION STREAK</span>
          <div className="flex items-end gap-2 mt-1">
            <span
              className="text-4xl font-black font-orbitron"
              style={{ color: '#FFB547', textShadow: '0 0 12px rgba(255,181,71,0.6)' }}
              aria-hidden="true"
            >
              <CountUp target={safeStreak} />
            </span>
            <span className="font-mono text-sm mb-1" style={{ color: 'rgba(255,181,71,0.6)' }}>
              {safeStreak === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
        </div>
      </div>

      {/* ── EMISSIONS VS BENCHMARK ─────────────────────────────────── */}
      <div
        className="glass rounded-2xl p-6 flex items-center gap-5 group transition-all duration-300 cursor-default overflow-hidden"
        style={{
          borderColor: isBelow ? '#00D4FF' : '#FF4D6D',
          boxShadow: isBelow
            ? '0 0 20px rgba(0,212,255,0.25), inset 0 0 20px rgba(0,212,255,0.04)'
            : '0 0 20px rgba(255,77,109,0.25), inset 0 0 20px rgba(255,77,109,0.04)',
        }}
        aria-label={`Emissions vs global benchmark: ${formatNumber(percentDiff)}% ${isBelow ? 'below' : 'above'} average`}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true"
          style={{
            background: isBelow
              ? 'linear-gradient(90deg, transparent 0%, #00D4FF 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, #FF4D6D 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite',
          }} />

        <div className="p-3 rounded-xl shrink-0" style={{
          background: isBelow ? 'rgba(0,212,255,0.1)' : 'rgba(255,77,109,0.1)',
          border: isBelow ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,77,109,0.3)',
        }}>
          {isBelow
            ? <TrendingDown size={28} aria-hidden="true" style={{ color: '#00D4FF', filter: 'drop-shadow(0 0 8px #00D4FF)' }}/>
            : <TrendingUp   size={28} aria-hidden="true" style={{ color: '#FF4D6D', filter: 'drop-shadow(0 0 8px #FF4D6D)' }}/>}
        </div>

        <div className="flex flex-col">
          <span className="mono-label" style={{ color: isBelow ? '#00D4FF' : '#FF4D6D', opacity: 0.8 }}>
            EMISSIONS VS GLOBAL BENCHMARK
          </span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-3xl font-black font-orbitron" aria-hidden="true" style={{
              color: isBelow ? '#00D4FF' : '#FF4D6D',
              textShadow: isBelow ? '0 0 12px rgba(0,212,255,0.6)' : '0 0 12px rgba(255,77,109,0.6)',
            }}>
              {formatNumber(percentDiff)}%
            </span>
            <span className="font-mono text-sm mb-1" style={{ color: isBelow ? 'rgba(0,212,255,0.6)' : 'rgba(255,77,109,0.6)' }}>
              {isBelow ? 'BELOW ↓' : 'ABOVE ↑'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

WeeklyProgress.propTypes = {
  streak:        PropTypes.number.isRequired,
  projectedTons: PropTypes.number.isRequired,
};

export default memo(WeeklyProgress);
