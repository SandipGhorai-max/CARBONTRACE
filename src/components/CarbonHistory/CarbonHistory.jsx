import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useCarbon } from '../../hooks/useCarbon';
import { useExport } from '../../hooks/useExport';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { trackEvent } from '../../services/firebase.analytics';
import { Button } from '../ui/Button';
import { ANALYTICS_EVENTS } from '../../constants';
import { formatNumber } from '../../utils/formatters';

/**
 * CarbonHistory component.
 * Displays a paginated log of past activities and allows exporting data.
 * @returns {JSX.Element}
 */
export const CarbonHistory = () => {
  const { activities, resetData } = useCarbon();
  const { exportData } = useExport();
  const { playAlert, playSuccess } = useSoundEngine();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleExport = (format) => {
    playAlert();
    const success = exportData(activities, format);
    if (success) {
      trackEvent(ANALYTICS_EVENTS.DATA_EXPORT, { format });
    }
  };

  const handleReset = () => {
    if (window.confirm("CRITICAL: Purge all telemetry data? This cannot be undone.")) {
      resetData();
      playSuccess();
      setPage(1);
    }
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage) || 1;
  const currentData = activities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <section aria-label="Activity History" className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">Data Core</h2>
        <div className="flex gap-2">
          <Button variant="ghost" className="!w-auto !py-1 !px-2 text-xs" onClick={() => handleExport('CSV')} disabled={activities.length === 0} aria-label="Export CSV">
            <Download size={14} className="mr-1 inline" /> CSV
          </Button>
          <Button variant="ghost" className="!w-auto !py-1 !px-2 text-xs" onClick={() => handleExport('JSON')} disabled={activities.length === 0} aria-label="Export JSON">
            <Download size={14} className="mr-1 inline" /> JSON
          </Button>
          <Button variant="danger" className="!w-auto !py-1 !px-2 text-xs" onClick={handleReset} disabled={activities.length === 0} aria-label="Reset Data">
            <RefreshCw size={14} className="mr-1 inline" /> PURGE
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-0">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
            <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center mb-4">
              <span className="block w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
            </div>
            <p className="font-mono text-sm tracking-widest">AWAITING TELEMETRY</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/50">
            {currentData.map((act) => (
              <li key={act.id} className="p-4 hover:bg-slate-800/30 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{act.category}</span>
                  <span className="font-mono text-cyan-400 font-bold">+{formatNumber(act.co2)} kg</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="capitalize">{act.type} (x{formatNumber(act.amount)})</span>
                  <span>{new Date(act.date).toLocaleDateString()} {new Date(act.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activities.length > 0 && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center text-xs">
          <Button variant="ghost" className="!w-auto !py-1 !px-3" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>PREV</Button>
          <span className="font-mono text-slate-400">PAGE {page}/{totalPages}</span>
          <Button variant="ghost" className="!w-auto !py-1 !px-3" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>NEXT</Button>
        </div>
      )}
    </section>
  );
};
