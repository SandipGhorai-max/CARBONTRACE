import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useCarbon } from '../hooks/useCarbon';
import { CO2_GREEN_MAX, CO2_AMBER_MAX } from '../constants';

const CarbonSummary = ({ liveCo2 }) => {
  const { projectedAnnualTons, streak } = useCarbon();

  // Pure functional derived state
  const { colorClass, status } = useMemo(() => {
    const projected = projectedAnnualTons;
    if (projected <= CO2_GREEN_MAX) return { colorClass: 'text-green-400', status: 'Excellent' };
    if (projected <= CO2_AMBER_MAX) return { colorClass: 'text-amber-400', status: 'Average' };
    return { colorClass: 'text-red-400', status: 'High' };
  }, [projectedAnnualTons]);

  return (
    <section aria-labelledby="summary-heading" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
      <h2 id="summary-heading" className="text-xl font-bold text-white mb-4 tracking-wide">Footprint Summary</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
          <p className="text-sm text-slate-400 font-semibold mb-1">Projected Annual</p>
          <p className={`text-3xl font-black ${colorClass}`}>
            {projectedAnnualTons.toFixed(2)}
            <span className="text-sm font-normal text-slate-500 ml-1">tons</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Status: {status}</p>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-semibold mb-1">Current Log Streak</p>
          <p className="text-3xl font-black text-cyan-400">
            {streak}
            <span className="text-sm font-normal text-slate-500 ml-1">days</span>
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-400 font-semibold">Live Input Projection</p>
          <p className="text-xs text-slate-500">Calculated as you type</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white" aria-live="polite">
            +{liveCo2.toFixed(2)} kg
          </p>
        </div>
      </div>
    </section>
  );
};

CarbonSummary.propTypes = {
  liveCo2: PropTypes.number.isRequired,
};

export default CarbonSummary;
