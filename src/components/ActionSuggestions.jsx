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
    "Plan meals carefully to minimize food waste.",
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

const ActionSuggestions = ({ highestImpactCategory }) => {
  if (!highestImpactCategory) {
    return (
      <div className="glass p-6 md:p-8 rounded-3xl border-cyan/20" role="region" aria-label="Protocol Recommendations">
        <div className="flex items-center gap-3 text-cyan mb-3">
          <Lightbulb size={24} aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <h2 className="text-xl font-bold font-orbitron">Protocol Recommendations</h2>
        </div>
        <p className="text-gray-400 leading-relaxed font-inter">
          Awaiting input data. Log activities to receive personalized efficiency protocols.
        </p>
      </div>
    );
  }

  const tips = SUGGESTIONS[highestImpactCategory] || [];
  const Icon = ICONS[highestImpactCategory] || Lightbulb;

  return (
    <div className="glass p-6 md:p-8 rounded-3xl text-gray-200" role="region" aria-label={`Action plan for ${highestImpactCategory}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-electric/10 rounded-xl border border-electric/30 shadow-[0_0_10px_rgba(0,255,135,0.2)]" aria-hidden="true">
          <Icon size={24} className="text-electric drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-orbitron tracking-wide">Action Plan</h2>
          <p className="text-cyan text-sm font-semibold uppercase tracking-widest mt-1">
            Target: <span aria-label={`Highest impact category: ${highestImpactCategory}`}>{highestImpactCategory}</span>
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-4" aria-label={`Recommendations for ${highestImpactCategory}`}>
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-3 bg-space/50 p-4 rounded-xl border border-cardBorder hover:border-cyan hover:shadow-[0_0_10px_rgba(0,212,255,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan/20 text-cyan text-sm font-bold shrink-0 mt-0.5 border border-cyan/30"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="text-gray-300 leading-relaxed text-sm md:text-base font-inter">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

ActionSuggestions.propTypes = {
  highestImpactCategory: PropTypes.oneOf([...Object.values(CATEGORIES), null]),
};

ActionSuggestions.defaultProps = {
  highestImpactCategory: null,
};

export default memo(ActionSuggestions);
