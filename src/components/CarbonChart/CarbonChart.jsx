import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { useCarbon } from '../../hooks/useCarbon';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CHART_CONFIG, CATEGORIES } from '../../constants';

/**
 * Chart config options. Extracted to avoid recreation on every render.
 */
const chartOptions = {
  backgroundColor: 'transparent',
  legend: { position: 'none' },
  hAxis: {
    textStyle: { color: CHART_CONFIG.AXIS_COLOR, fontName: 'Inter' },
    gridlines: { color: 'transparent' },
    baselineColor: CHART_CONFIG.AXIS_COLOR,
  },
  vAxis: {
    textStyle: { color: CHART_CONFIG.AXIS_COLOR, fontName: 'Inter' },
    gridlines: { color: CHART_CONFIG.GRID_COLOR, count: 4 },
    baselineColor: CHART_CONFIG.GRID_COLOR,
    format: '# kg',
  },
  bar: { groupWidth: '60%' },
  colors: [CHART_CONFIG.BAR_COLOR],
  animation: {
    startup: true,
    duration: CHART_CONFIG.ANIMATION_DURATION,
    easing: 'out',
  },
  tooltip: {
    isHtml: false,
    textStyle: { fontName: 'Inter', fontSize: 14 },
  },
};

/**
 * CarbonChart component.
 * Displays a 7-day history of carbon emissions.
 * @returns {JSX.Element}
 */
export const CarbonChart = () => {
  const { activities } = useCarbon();

  const chartData = useMemo(() => {
    const data = [['Day', 'CO2 (kg)']];
    if (!activities || activities.length === 0) {
      data.push(['No Data', 0]);
      return data;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTotals = Array(CHART_CONFIG.MAX_HISTORY_DAYS).fill(0);
    const dayLabels = Array(CHART_CONFIG.MAX_HISTORY_DAYS).fill('');

    for (let i = 0; i < CHART_CONFIG.MAX_HISTORY_DAYS; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - (CHART_CONFIG.MAX_HISTORY_DAYS - 1 - i));
      dayLabels[i] = d.toLocaleDateString('en-US', { weekday: 'short' });
    }

    activities.forEach(act => {
      const actDate = new Date(act.date);
      actDate.setHours(0, 0, 0, 0);
      const diffTime = today - actDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < CHART_CONFIG.MAX_HISTORY_DAYS) {
        const index = CHART_CONFIG.MAX_HISTORY_DAYS - 1 - diffDays;
        dailyTotals[index] += act.co2;
      }
    });

    for (let i = 0; i < CHART_CONFIG.MAX_HISTORY_DAYS; i++) {
      data.push([dayLabels[i], dailyTotals[i]]);
    }

    return data;
  }, [activities]);

  return (
    <section aria-label="Emissions Chart" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">7-Day Telemetry</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs text-cyan-400 font-mono tracking-wider">LIVE</span>
        </div>
      </div>
      
      <div className="h-[250px] w-full" aria-hidden="true">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="100%"
          data={chartData}
          options={chartOptions}
          loader={<LoadingSpinner />}
        />
      </div>
    </section>
  );
};
