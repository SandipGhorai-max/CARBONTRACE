import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * NeuralNetworkCard — 3 animated bars: ANALYZE, PREDICT, OPTIMIZE
 * Each bar fills and loops continuously like a loading indicator.
 */

const BAR_DATA = [
  { label: 'ANALYZE',  color: '#00D4FF', delay: '0s',   duration: '2.5s' },
  { label: 'PREDICT',  color: '#00FF87', delay: '0.4s', duration: '3s'   },
  { label: 'OPTIMIZE', color: '#FFB547', delay: '0.8s', duration: '3.5s' },
];

const NeuralNetworkCard = () => (
  <div className="glass rounded-2xl p-5" role="region" aria-label="AI Neural Network Status"
    style={{ borderColor: '#00D4FF33', boxShadow: '0 0 16px rgba(0,212,255,0.15)' }}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" aria-hidden="true"/>
      <h3 className="font-orbitron font-black text-xs tracking-widest" style={{ color: '#00D4FF', textShadow: '0 0 20px #00D4FF' }}>
        AI NEURAL NETWORK STATUS
      </h3>
    </div>
    <div className="flex flex-col gap-3">
      {BAR_DATA.map(bar => (
        <div key={bar.label} className="flex items-center gap-3">
          <span className="font-mono text-xs w-16 shrink-0" style={{ color: bar.color, fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            {bar.label}
          </span>
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: '#0A1628', border: '1px solid #1A3A5C' }}>
            <div className="h-full rounded-full" style={{
              background: `linear-gradient(90deg, transparent, ${bar.color}, transparent)`,
              backgroundSize: '200% 100%',
              animation: `shimmer ${bar.duration} linear infinite`,
              animationDelay: bar.delay,
              boxShadow: `0 0 8px ${bar.color}66`,
            }}/>
          </div>
          <span className="font-mono text-xs" style={{ color: `${bar.color}88`, fontSize: '0.55rem' }}>ACTIVE</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * NeuralNetworkCard accepts no external props — all state is internal.
 * Explicitly declared here so prop-type checkers do not flag it.
 */
NeuralNetworkCard.propTypes = {};

export default memo(NeuralNetworkCard);
