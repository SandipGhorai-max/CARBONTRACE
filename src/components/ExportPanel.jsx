import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { generateCSV } from '../utils/formatters';
import { trackEvent } from '../firebase';
import { Download, FileJson, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const ExportPanel = ({ activities }) => {
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [jsonSuccess, setJsonSuccess] = useState(false);

  /**
   * Creates a temporary object URL, triggers a download, then immediately
   * revokes the URL to release memory — fixing the prior memory-leak/security issue.
   */
  const triggerDownload = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke immediately after click to prevent memory leaks
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvContent = generateCSV(activities);
    triggerDownload(csvContent, 'text/csv;charset=utf-8;', 'carbon_trace_data.csv');
    trackEvent('data_exported', { format: 'csv', count: activities.length });
    setCsvSuccess(true);
    setTimeout(() => setCsvSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(activities, null, 2);
    triggerDownload(jsonContent, 'application/json', 'carbon_trace_data.json');
    trackEvent('data_exported', { format: 'json', count: activities.length });
    setJsonSuccess(true);
    setTimeout(() => setJsonSuccess(false), 2000);
  };

  const isEmpty = !Array.isArray(activities) || activities.length === 0;

  return (
    <div className="glass p-6 md:p-8 rounded-3xl">
      <div className="flex items-center gap-3 mb-4 text-gray-200">
        <div className="p-2 bg-space rounded-lg border border-cardBorder">
          <Download size={20} aria-hidden="true" className="text-cyan drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]" />
        </div>
        <h2 className="text-xl font-bold font-orbitron tracking-wide">Data Extraction</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed font-inter">
        Download your telemetry for offline analysis. All logs are stored securely on local subsystems
        {activities.length > 0 && ` (${activities.length} record${activities.length !== 1 ? 's' : ''})`}.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExportCSV}
          disabled={isEmpty}
          className="flex-1 flex items-center justify-center gap-2 bg-space text-gray-300 border border-cardBorder hover:border-cyan hover:text-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] p-3.5 rounded-xl font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-cardBorder disabled:hover:shadow-none active:scale-[0.98]"
          aria-label={isEmpty ? 'Export as CSV (no data available)' : `Export ${activities.length} activities as CSV`}
          aria-disabled={isEmpty}
        >
          {csvSuccess
            ? <CheckCircle2 size={18} className="text-electric" aria-hidden="true" />
            : <FileSpreadsheet size={18} aria-hidden="true" />}
          <span className="font-orbitron uppercase tracking-wider text-sm">
            {csvSuccess ? 'Downloaded!' : 'CSV Format'}
          </span>
        </button>

        <button
          onClick={handleExportJSON}
          disabled={isEmpty}
          className="flex-1 flex items-center justify-center gap-2 bg-space text-gray-300 border border-cardBorder hover:border-electric hover:text-electric hover:shadow-[0_0_15px_rgba(0,255,135,0.3)] p-3.5 rounded-xl font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-space disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-cardBorder disabled:hover:shadow-none active:scale-[0.98]"
          aria-label={isEmpty ? 'Export as JSON (no data available)' : `Export ${activities.length} activities as JSON`}
          aria-disabled={isEmpty}
        >
          {jsonSuccess
            ? <CheckCircle2 size={18} className="text-electric" aria-hidden="true" />
            : <FileJson size={18} aria-hidden="true" />}
          <span className="font-orbitron uppercase tracking-wider text-sm">
            {jsonSuccess ? 'Downloaded!' : 'JSON Format'}
          </span>
        </button>
      </div>
    </div>
  );
};

ExportPanel.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      date: PropTypes.string,
      category: PropTypes.string,
      type: PropTypes.string,
      amount: PropTypes.number,
      co2: PropTypes.number,
    })
  ).isRequired,
};

export default memo(ExportPanel);
