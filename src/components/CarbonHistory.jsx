import React, { useState } from 'react';
import { useCarbon } from '../hooks/useCarbon';
import { formatNumber, generateCSV, generateJSON } from '../utils/formatters';
import { trackEvent } from '../firebase';

const CarbonHistory = () => {
  const { activities, resetData } = useCarbon();
  const [exportFormat, setExportFormat] = useState('CSV');

  const handleExport = () => {
    try {
      const dataStr = exportFormat === 'CSV' ? generateCSV(activities) : generateJSON(activities);
      const mimeType = exportFormat === 'CSV' ? 'text/csv' : 'application/json';
      const fileExt = exportFormat === 'CSV' ? 'csv' : 'json';

      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carbon_history.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      trackEvent('data_export', { format: exportFormat, count: activities.length });
    } catch (error) {
      console.error("Export failed:", error); // Error handling
    }
  };

  return (
    <section aria-labelledby="history-heading" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 id="history-heading" className="text-xl font-bold text-white tracking-wide">History</h2>
        
        <div className="flex gap-2">
          <select 
            value={exportFormat} 
            onChange={e => setExportFormat(e.target.value)}
            className="p-2 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg outline-none"
            aria-label="Select export format"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-lg border border-slate-700 transition-colors"
            aria-label={`Export data as ${exportFormat}`}
          >
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">
            No activity logged yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {activities.map((act) => (
              <li key={act.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex justify-between items-center hover:border-slate-600 transition-colors">
                <div>
                  <p className="text-white font-bold text-sm">{act.type}</p>
                  <p className="text-xs text-slate-400">{new Date(act.date).toLocaleDateString()} • {act.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-bold">{formatNumber(act.co2)} kg</p>
                  <p className="text-xs text-slate-500">{formatNumber(act.amount)} units</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 shrink-0">
          <button 
            onClick={resetData}
            className="w-full px-4 py-3 bg-slate-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 border border-slate-700 hover:border-red-500/30 rounded-lg font-bold transition-all text-sm uppercase tracking-wider"
          >
            Reset All Data
          </button>
        </div>
      )}
    </section>
  );
};

export default CarbonHistory;
