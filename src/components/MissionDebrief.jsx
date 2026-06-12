import React, { memo, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * MissionDebrief — 7-day holographic bar chart.
 * Uses thin glowing lines, not solid fills. Each bar pulses.
 * Since we don't have real historical data per day, we synthesize
 * plausible values from the current activities list.
 */
const MissionDebrief = ({ activities = [] }) => {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Group activities by day-of-week of their date
  const weekData = useMemo(() => {
    const buckets = Array(7).fill(0);
    if (!Array.isArray(activities)) return buckets;
    activities.forEach(a => {
      if (!a.date) return;
      const dow = new Date(a.date).getDay(); // 0=Sun
      const idx = dow === 0 ? 6 : dow - 1;   // shift to Mon=0
      buckets[idx] += (a.co2 || 0);
    });
    return buckets;
  }, [activities]);

  const maxVal = Math.max(...weekData, 1);

  return (
    <div className="glass rounded-3xl p-6 md:p-8" role="region" aria-label="7-Day Emissions Intelligence Report"
      style={{ borderColor: '#00D4FF22' }}>

      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={18} style={{ color: '#00D4FF', filter: 'drop-shadow(0 0 6px #00D4FF)' }} aria-hidden="true"/>
        <h2 className="font-orbitron font-black text-sm tracking-widest" style={{ color: '#e5e7eb', textShadow: '0 0 20px currentColor' }}>
          7-DAY EMISSIONS INTELLIGENCE REPORT
        </h2>
      </div>

      <div className="flex items-end justify-between gap-2" style={{ height: 160 }} role="img" aria-label="Weekly emissions bar chart">
        {DAYS.map((day, i) => {
          const pct = (weekData[i] / maxVal) * 100;
          const barHeight = Math.max(pct, 4); // minimum visible bar
          const color = weekData[i] > maxVal * 0.7 ? '#FF4D6D' : weekData[i] > maxVal * 0.4 ? '#FFB547' : '#00D4FF';

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              {/* Value label */}
              <span className="font-mono text-xs" style={{ color: `${color}88`, fontSize: '0.55rem' }}>
                {weekData[i] > 0 ? `${weekData[i].toFixed(1)}` : '—'}
              </span>

              {/* Holographic bar */}
              <div className="w-full flex justify-center" style={{ height: 120 }}>
                <div className="relative w-3 rounded-full overflow-hidden flex flex-col justify-end"
                  style={{ height: '100%', background: '#0A162844' }}>
                  <div className="w-full rounded-full relative" style={{
                    height: `${barHeight}%`,
                    background: `linear-gradient(180deg, ${color}11, ${color}44)`,
                    border: `1px solid ${color}66`,
                    boxShadow: `0 0 8px ${color}44, inset 0 0 8px ${color}22`,
                    transition: 'height 1s cubic-bezier(0.16,1,0.3,1)',
                    animation: `pulseSlow 3s ease-in-out infinite ${i * 0.3}s`,
                  }}>
                    {/* Inner glow line */}
                    <div className="absolute inset-x-0 top-0 h-px" style={{ background: color, boxShadow: `0 0 6px ${color}` }}/>
                  </div>
                </div>
              </div>

              {/* Day label */}
              <span className="font-mono text-xs" style={{ color: '#4A7A9B', fontSize: '0.55rem', letterSpacing: '0.05em' }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom stat line */}
      <div className="mt-4 pt-3 flex justify-between font-mono text-xs"
        style={{ borderTop: '1px solid #1A3A5C33', color: '#4A7A9B', fontSize: '0.6rem' }}>
        <span>TOTAL: {weekData.reduce((a, b) => a + b, 0).toFixed(1)} kg CO₂</span>
        <span>AVG: {(weekData.reduce((a, b) => a + b, 0) / 7).toFixed(1)} kg/day</span>
      </div>
    </div>
  );
};

export default memo(MissionDebrief);
