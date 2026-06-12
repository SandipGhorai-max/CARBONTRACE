import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from '../firebase';
import { Leaf, Bike, Lightbulb, Check } from 'lucide-react';

const PROTOCOLS = [
  {
    icon: Bike,
    title: 'SWITCH TO CYCLING',
    desc: 'Replace 3 car trips per week with cycling for distances under 5 miles.',
    saved: '0.12',
    color: '#00FF87',
  },
  {
    icon: Leaf,
    title: 'PLANT-BASED MEALS',
    desc: 'Swap 4 meat meals per week for plant-based alternatives.',
    saved: '0.08',
    color: '#00D4FF',
  },
  {
    icon: Lightbulb,
    title: 'ENERGY OPTIMIZATION',
    desc: 'Switch off standby devices and reduce thermostat by 2°F.',
    saved: '0.05',
    color: '#FFB547',
  },
];

const OptimizationProtocols = () => {
  const [deployed, setDeployed] = useState({});

  const handleDeploy = (idx) => {
    setDeployed(prev => ({ ...prev, [idx]: true }));
    trackEvent('protocol_deployed', { protocol: PROTOCOLS[idx].title });
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8" role="region" aria-label="AI Optimization Protocols"
      style={{ borderColor: '#00FF8722' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #00FF87, #00D4FF)' }} aria-hidden="true"/>
        <h2 className="font-orbitron font-black text-sm tracking-widest" style={{ color: '#e5e7eb', textShadow: '0 0 20px currentColor' }}>
          AI OPTIMIZATION PROTOCOLS
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PROTOCOLS.map((p, i) => {
          const Icon = p.icon;
          const isDone = deployed[i];
          return (
            <div key={i} className="rounded-2xl p-5 border transition-all duration-500 flex flex-col"
              style={{
                background: isDone ? `${p.color}08` : 'rgba(2,9,23,0.7)',
                borderColor: isDone ? p.color : '#1A3A5C',
                boxShadow: isDone ? `0 0 20px ${p.color}33` : 'none',
                animation: `slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both`,
                animationDelay: `${0.2 + i * 0.15}s`,
              }}>

              {/* Icon */}
              <div className="p-2.5 rounded-xl mb-3 w-fit"
                style={{ background: `${p.color}14`, border: `1px solid ${p.color}33` }}>
                <Icon size={22} style={{ color: p.color, filter: `drop-shadow(0 0 6px ${p.color})` }} aria-hidden="true"/>
              </div>

              {/* Title */}
              <h3 className="font-orbitron font-black text-xs tracking-wider mb-2"
                style={{ color: '#e5e7eb', textShadow: '0 0 20px currentColor' }}>{p.title}</h3>
              <p className="font-inter text-xs mb-3 flex-1" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.desc}</p>

              {/* CO₂ saved */}
              <div className="font-mono text-xs mb-3" style={{ color: p.color }}>
                ▸ EST. SAVINGS: <strong>{p.saved}t CO₂/yr</strong>
              </div>

              {/* Deploy button */}
              <button onClick={() => handleDeploy(i)} disabled={isDone}
                className="w-full py-2.5 rounded-lg font-orbitron font-black text-xs tracking-wider transition-all"
                style={{
                  background: isDone ? `${p.color}22` : `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                  color: isDone ? p.color : '#020917',
                  border: `1px solid ${isDone ? p.color : 'transparent'}`,
                  cursor: isDone ? 'default' : 'pointer',
                  boxShadow: isDone ? 'none' : `0 0 16px ${p.color}44`,
                }}
                aria-label={isDone ? `${p.title} protocol deployed` : `Deploy ${p.title} protocol`}>
                {isDone ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={14} aria-hidden="true"/>DEPLOYED ✓
                  </span>
                ) : 'DEPLOY PROTOCOL →'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(OptimizationProtocols);
