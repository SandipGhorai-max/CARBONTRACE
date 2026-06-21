import React, { useMemo } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { formatNumber } from '../../utils/formatters';
import { CarbonSummaryProps } from '../../types/propTypes';

/**
 * CarbonSummary component.
 * Displays total and projected emissions.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
export const CarbonSummary = ({ liveCo2 }) => {
  const { totalCO2Kg, projectedAnnualTons, highestImpactCategory, streak } = useCarbon();

  const displayTotal = useMemo(() => totalCO2Kg + liveCo2, [totalCO2Kg, liveCo2]);

  return (
    <section aria-label="Emissions Summary" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-green-400 to-cyan-500 bg-[length:200%_100%] animate-shimmer" />
      
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">System Status</h2>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <span className="text-orange-400">🔥</span>
          <span className="font-mono text-sm text-white font-bold">{streak} Day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Total Emitted</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">
              {formatNumber(displayTotal)}
            </span>
            <span className="text-sm text-cyan-400 font-bold">kg</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Projected Annual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">
              {formatNumber(projectedAnnualTons, 2)}
            </span>
            <span className="text-sm text-green-400 font-bold">tonnes</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Primary Source</span>
        <span className="text-sm font-bold text-white uppercase tracking-widest">{highestImpactCategory || 'N/A'}</span>
      </div>
    </section>
  );
};

CarbonSummary.propTypes = CarbonSummaryProps;
