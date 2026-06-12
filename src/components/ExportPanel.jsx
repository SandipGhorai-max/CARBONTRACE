import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { generateCSV } from '../utils/formatters';
import { trackEvent } from '../firebase';
import { Download, FileJson, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const ExportPanel = ({ activities }) => {
  const [csvSuccess,  setCsvSuccess]  = useState(false);
  const [jsonSuccess, setJsonSuccess] = useState(false);

  const triggerDownload = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    triggerDownload(generateCSV(activities), 'text/csv;charset=utf-8;', 'carbon_trace_data.csv');
    trackEvent('data_exported', { format: 'csv', count: activities.length });
    setCsvSuccess(true);
    setTimeout(() => setCsvSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    triggerDownload(JSON.stringify(activities, null, 2), 'application/json', 'carbon_trace_data.json');
    trackEvent('data_exported', { format: 'json', count: activities.length });
    setJsonSuccess(true);
    setTimeout(() => setJsonSuccess(false), 2000);
  };

  const isEmpty = !Array.isArray(activities) || activities.length === 0;

  const btnBase = {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 16px', borderRadius: 12, fontWeight: 700, transition: 'all 0.2s',
    cursor: isEmpty ? 'not-allowed' : 'pointer', opacity: isEmpty ? 0.4 : 1,
    fontFamily: "'Orbitron', sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Download size={16} aria-hidden="true" style={{ color: '#00D4FF', filter: 'drop-shadow(0 0 4px #00D4FF)' }} />
        <h2 className="font-orbitron font-black text-sm tracking-widest" style={{ color: '#e5e7eb' }}>
          DATA EXTRACTION
        </h2>
      </div>
      <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
        {isEmpty
          ? '▸ NO TELEMETRY LOGGED — AWAITING FIELD DATA'
          : `▸ ${activities.length} RECORD${activities.length !== 1 ? 'S' : ''} READY FOR EXTRACTION`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <button onClick={!isEmpty ? handleExportCSV : undefined}
          disabled={isEmpty}
          style={{ ...btnBase,
            background: csvSuccess ? 'rgba(0,255,135,0.1)' : 'rgba(0,212,255,0.06)',
            border: `1px solid ${csvSuccess ? '#00FF87' : '#00D4FF44'}`,
            color: csvSuccess ? '#00FF87' : '#00D4FF',
            boxShadow: csvSuccess ? '0 0 12px rgba(0,255,135,0.4)' : 'none',
          }}
          aria-label={isEmpty ? 'Export as CSV (no data available)' : `Export ${activities.length} activities as CSV`}
          aria-disabled={isEmpty}>
          {csvSuccess ? <CheckCircle2 size={15} aria-hidden="true" /> : <FileSpreadsheet size={15} aria-hidden="true" />}
          {csvSuccess ? 'EXTRACTED' : 'CSV'}
        </button>

        <button onClick={!isEmpty ? handleExportJSON : undefined}
          disabled={isEmpty}
          style={{ ...btnBase,
            background: jsonSuccess ? 'rgba(0,255,135,0.1)' : 'rgba(0,255,135,0.06)',
            border: `1px solid ${jsonSuccess ? '#00FF87' : '#00FF8744'}`,
            color: jsonSuccess ? '#00FF87' : '#00FF87',
            boxShadow: jsonSuccess ? '0 0 12px rgba(0,255,135,0.4)' : 'none',
          }}
          aria-label={isEmpty ? 'Export as JSON (no data available)' : `Export ${activities.length} activities as JSON`}
          aria-disabled={isEmpty}>
          {jsonSuccess ? <CheckCircle2 size={15} aria-hidden="true" /> : <FileJson size={15} aria-hidden="true" />}
          {jsonSuccess ? 'EXTRACTED' : 'JSON'}
        </button>
      </div>
    </div>
  );
};

ExportPanel.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string, date: PropTypes.string, category: PropTypes.string,
    type: PropTypes.string, amount: PropTypes.number, co2: PropTypes.number,
  })).isRequired,
};

export default memo(ExportPanel);
