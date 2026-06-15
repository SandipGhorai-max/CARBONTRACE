import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { useCarbon } from '../hooks/useCarbon';

const CarbonChart = () => {
  const { activities } = useCarbon();

  const data = useMemo(() => {
    // Generate last 7 days including today
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    // Aggregate CO2 per day
    const dailyTotals = days.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {});

    activities.forEach(act => {
      const actDate = act.date.split('T')[0];
      if (dailyTotals[actDate] !== undefined) {
        dailyTotals[actDate] += act.co2;
      }
    });

    // Format for Google Charts
    const chartData = [['Date', 'CO₂ (kg)', { role: 'style' }]];
    
    days.forEach(date => {
      const amount = dailyTotals[date];
      const shortDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      // Use Tailwind cyan-400 for bars
      chartData.push([shortDate, amount, 'color: #22d3ee']);
    });

    return chartData;
  }, [activities]);

  const options = {
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    hAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: 'transparent' },
    },
    vAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: '#334155' },
      baselineColor: '#334155',
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    tooltip: { isHtml: false },
  };

  return (
    <section aria-labelledby="chart-heading" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
      <h2 id="chart-heading" className="text-xl font-bold text-white mb-4 tracking-wide">7-Day Trend</h2>
      
      <div className="w-full h-[250px]">
        {activities.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
            Log activity to see chart.
          </div>
        ) : (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="100%"
            data={data}
            options={options}
            loader={<div className="w-full h-full flex items-center justify-center text-cyan-400 animate-pulse">Loading Chart...</div>}
          />
        )}
      </div>
    </section>
  );
};

export default CarbonChart;
