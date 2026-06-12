import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Flame, TrendingDown, TrendingUp } from 'lucide-react';
import { GLOBAL_AVERAGE_TONS } from '../constants/carbonFactors';
import { formatNumber } from '../utils/formatters';

const WeeklyProgress = ({ streak, projectedTons }) => {
  // Guard against NaN/undefined projectedTons
  const safeTons = isNaN(projectedTons) || projectedTons === null || projectedTons === undefined ? 0 : projectedTons;
  const safeStreak = isNaN(streak) || streak === null ? 0 : streak;

  const difference = safeTons - GLOBAL_AVERAGE_TONS;
  const percentDiff = Math.abs((difference / GLOBAL_AVERAGE_TONS) * 100);
  const isBelow = difference <= 0;

  const streakLabel = `${safeStreak} ${safeStreak === 1 ? 'day' : 'days'} streak`;
  const comparisonLabel = `${formatNumber(percentDiff)}% ${isBelow ? 'below' : 'above'} global average`;

  return (
    <div
      className="glass p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row gap-6 w-full justify-between items-center transition-all"
      role="region"
      aria-label="Your progress summary"
    >
      {/* Streak Counter */}
      <div
        className="relative overflow-hidden flex items-center gap-5 bg-space/80 px-6 py-5 rounded-2xl w-full sm:w-auto flex-1 border border-cardBorder group hover:border-electric transition-colors"
        aria-label={`Current logging streak: ${streakLabel}`}
      >
        <div className="absolute inset-0 bg-electric/5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
        <div className="p-3.5 bg-electric/10 text-electric rounded-xl border border-electric/30 shadow-[0_0_10px_rgba(0,255,135,0.2)] z-10">
          <Flame size={28} aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]" />
        </div>
        <div className="flex flex-col z-10">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-0.5 font-inter">Current Streak</h3>
          <p className="text-3xl font-black text-electric font-orbitron drop-shadow-[0_0_5px_rgba(0,255,135,0.5)]" aria-hidden="true">
            {safeStreak}{' '}
            <span className="text-xl font-semibold opacity-70 font-inter text-electric/70">
              {safeStreak === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>
      </div>

      {/* Comparison against global average */}
      <div
        className={`relative overflow-hidden flex items-center gap-5 px-6 py-5 rounded-2xl w-full sm:w-auto flex-1 border border-cardBorder group transition-colors ${isBelow ? 'hover:border-cyan' : 'hover:border-coral'}`}
        aria-label={`Performance vs global average: ${comparisonLabel}`}
      >
        <div
          className={`absolute inset-0 opacity-20 animate-shimmer ${isBelow ? 'from-cyan' : 'from-coral'} bg-gradient-to-r via-transparent to-transparent`}
          aria-hidden="true"
        ></div>
        <div className={`p-3.5 rounded-xl border z-10 shadow-lg ${isBelow ? 'bg-cyan/10 text-cyan border-cyan/30 shadow-[0_0_10px_rgba(0,212,255,0.2)]' : 'bg-coral/10 text-coral border-coral/30 shadow-[0_0_10px_rgba(255,77,109,0.2)]'}`}>
          {isBelow
            ? <TrendingDown size={28} aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            : <TrendingUp size={28} aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]" />}
        </div>
        <div className="flex flex-col z-10">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-0.5 font-inter">Vs Global Avg</h3>
          <p className={`text-2xl font-black font-orbitron drop-shadow-md ${isBelow ? 'text-cyan' : 'text-coral'}`} aria-hidden="true">
            {formatNumber(percentDiff)}%{' '}
            <span className="text-lg font-semibold opacity-70 font-inter">
              {isBelow ? 'below' : 'above'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

WeeklyProgress.propTypes = {
  streak: PropTypes.number.isRequired,
  projectedTons: PropTypes.number.isRequired,
};

export default memo(WeeklyProgress);
