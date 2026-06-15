import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CO2_GREEN_MAX, CO2_AMBER_MAX } from '../constants';

const INSIGHTS = {
  green: "Your footprint is well below average. Keep maintaining your sustainable habits! You're a climate champion.",
  amber: "You're within average limits. Consider replacing short car trips with biking or adjusting your thermostat to reduce further.",
  red: "Your emissions are high. Focus on major reduction areas: reducing meat intake, flying less, and switching to renewable energy."
};

const AIInsight = ({ projectedAnnualTons }) => {
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const level = projectedAnnualTons <= CO2_GREEN_MAX ? 'green' 
              : projectedAnnualTons <= CO2_AMBER_MAX ? 'amber' 
              : 'red';
              
  const fullText = INSIGHTS[level];

  // Reset typewriter when the level changes
  useEffect(() => {
    setTypedText('');
    setCharIndex(0);
  }, [level]);

  // Typewriter effect
  useEffect(() => {
    if (charIndex >= fullText.length) return;
    const timer = setTimeout(() => {
      setTypedText(prev => prev + fullText[charIndex]);
      setCharIndex(prev => prev + 1);
    }, 30);
    
    return () => clearTimeout(timer);
  }, [charIndex, fullText]);

  const borderColor = level === 'green' ? 'border-green-500' 
                    : level === 'amber' ? 'border-amber-500' 
                    : 'border-red-500';
                    
  const textColor = level === 'green' ? 'text-green-400' 
                  : level === 'amber' ? 'text-amber-400' 
                  : 'text-red-400';

  return (
    <section aria-label="AI Generated Insight" className={`bg-slate-900 border ${borderColor} p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full animate-pulse ${level === 'green' ? 'bg-green-500' : level === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} aria-hidden="true" />
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">AI INSIGHT</h3>
      </div>
      
      <div className="font-mono text-sm leading-relaxed min-h-[60px]" aria-live="polite">
        <span className={textColor}>{typedText}</span>
        <span className={`inline-block w-2 h-4 ml-1 align-middle animate-blink ${level === 'green' ? 'bg-green-500' : level === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} aria-hidden="true" />
      </div>
    </section>
  );
};

AIInsight.propTypes = {
  projectedAnnualTons: PropTypes.number.isRequired,
};

export default AIInsight;
