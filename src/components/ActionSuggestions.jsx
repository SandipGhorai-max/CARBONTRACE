import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES } from '../constants/carbonFactors';
import { Lightbulb, Car, Utensils, Zap, ShoppingBag } from 'lucide-react';

const SUGGESTIONS = {
  [CATEGORIES.TRANSPORT]: [
    "Opt for public transport or carpooling twice a week.",
    "Combine errands to reduce total driving distance.",
    "Consider walking or cycling for trips under 2 miles.",
  ],
  [CATEGORIES.FOOD]: [
    "Swap one meat-based meal for a plant-based alternative each week.",
    "Buy local and seasonal produce to reduce transportation emissions.",
    "Plan meals carefully to minimise food waste.",
  ],
  [CATEGORIES.ENERGY]: [
    "Switch to LED bulbs and turn off lights when leaving a room.",
    "Adjust your thermostat by 1–2 degrees to save on heating and cooling.",
    "Unplug electronics that consume standby power when not in use.",
  ],
  [CATEGORIES.SHOPPING]: [
    "Buy second-hand or vintage clothing when possible.",
    "Repair electronics instead of replacing them immediately.",
    "Choose products with minimal or recyclable packaging.",
  ],
};

const ICONS = {
  [CATEGORIES.TRANSPORT]: Car,
  [CATEGORIES.FOOD]: Utensils,
  [CATEGORIES.ENERGY]: Zap,
  [CATEGORIES.SHOPPING]: ShoppingBag,
};

const CATEGORY_COLORS = {
  [CATEGORIES.TRANSPORT]: '#00D4FF',
  [CATEGORIES.FOOD]:      '#FFB547',
  [CATEGORIES.ENERGY]:    '#00FF87',
  [CATEGORIES.SHOPPING]:  '#FF4D6D',
};

const ActionSuggestions = ({ highestImpactCategory }) => {
  if (!highestImpactCategory) {
    return (
      <div className="glass rounded-3xl p-6 md:p-8" role="region" aria-label="Protocol Recommendations">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={20} aria-hidden="true" style={{ color: '#00D4FF', filter: 'drop-shadow(0 0 6px #00D4FF)' }} />
          <h2 className="font-orbitron font-black text-base tracking-wider" style={{ color: '#e5e7eb' }}>
            PROTOCOL RECOMMENDATIONS
          </h2>
        </div>
        <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
          ▸ AWAITING FIELD DATA INPUT<br />
          ▸ LOG ACTIVITIES TO RECEIVE PERSONALIZED EFFICIENCY PROTOCOLS
        </p>
      </div>
    );
  }

  const tips  = SUGGESTIONS[highestImpactCategory] || [];
  const Icon  = ICONS[highestImpactCategory] || Lightbulb;
  const color = CATEGORY_COLORS[highestImpactCategory] || '#00D4FF';

  return (
    <div className="glass rounded-3xl p-6 md:p-8"
      style={{ borderColor: `${color}44` }}
      role="region" aria-label={`Action plan for ${highestImpactCategory}`}>

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl shrink-0"
          style={{ background: `${color}14`, border: `1px solid ${color}44` }}>
          <Icon size={22} aria-hidden="true" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
        </div>
        <div>
          <h2 className="font-orbitron font-black text-sm tracking-widest" style={{ color: '#e5e7eb' }}>
            ACTION PLAN
          </h2>
          <p className="font-mono text-xs mt-0.5 tracking-widest" style={{ color }}>
            ▸ TARGET: {highestImpactCategory.toUpperCase()}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-3" aria-label={`Recommendations for ${highestImpactCategory}`}>
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl p-3.5 border transition-all duration-300 group cursor-default"
            style={{ background: 'rgba(2,9,23,0.7)', borderColor: '#1A3A5C' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.boxShadow = `0 0 12px ${color}33`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1A3A5C';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-orbitron font-black shrink-0 mt-0.5"
              style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
              aria-hidden="true">{i + 1}</span>
            <span className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

ActionSuggestions.propTypes = {
  highestImpactCategory: PropTypes.oneOf([...Object.values(CATEGORIES), null]),
};
ActionSuggestions.defaultProps = { highestImpactCategory: null };
export default memo(ActionSuggestions);
