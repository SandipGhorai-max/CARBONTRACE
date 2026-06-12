import React, { Suspense, lazy } from 'react';
import { useCarbon } from '../hooks/useCarbon';
import ActivityForm from './ActivityForm';
import ActionSuggestions from './ActionSuggestions';
import WeeklyProgress from './WeeklyProgress';
import ExportPanel from './ExportPanel';
import PlanetPowerBar from './PlanetPowerBar';
import ErrorBoundary from './ErrorBoundary';

const PlanetGauge = lazy(() => import('./PlanetGauge'));

/* ── AI Robot Head (pure CSS/SVG) ─────────────────────────────────────────── */
const AIRobot = () => (
  <div className="relative flex-shrink-0" aria-hidden="true" style={{ width: 52, height: 52 }}>
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
      {/* Antenna */}
      <line x1="26" y1="2" x2="26" y2="10" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="2" r="2" fill="#00FF87" className="animate-pulse-dot"/>
      {/* Head body */}
      <rect x="8" y="10" width="36" height="28" rx="6" fill="rgba(10,22,40,0.9)" stroke="#00D4FF" strokeWidth="1.5"/>
      {/* Eyes */}
      <rect x="13" y="18" width="10" height="7" rx="2" fill="#00FF87" className="animate-eyes-pulse"
        style={{ filter: 'drop-shadow(0 0 4px #00FF87) drop-shadow(0 0 8px #00FF87)' }}/>
      <rect x="29" y="18" width="10" height="7" rx="2" fill="#00FF87" className="animate-eyes-pulse"
        style={{ filter: 'drop-shadow(0 0 4px #00FF87) drop-shadow(0 0 8px #00FF87)', animationDelay: '0.3s' }}/>
      {/* Pupils */}
      <rect x="16" y="20" width="4" height="3" rx="1" fill="#020917"/>
      <rect x="32" y="20" width="4" height="3" rx="1" fill="#020917"/>
      {/* Mouth grill */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={14 + i*7} y1="31" x2={14 + i*7} y2="34"
          stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      ))}
      {/* Chin */}
      <rect x="20" y="38" width="12" height="4" rx="2" fill="rgba(10,22,40,0.9)" stroke="#1A3A5C" strokeWidth="1"/>
      {/* Ears */}
      <rect x="4" y="18" width="4" height="8" rx="2" fill="rgba(10,22,40,0.9)" stroke="#00D4FF" strokeWidth="1"/>
      <rect x="44" y="18" width="4" height="8" rx="2" fill="rgba(10,22,40,0.9)" stroke="#00D4FF" strokeWidth="1"/>
    </svg>
  </div>
);

/* ── Blinking cursor ──────────────────────────────────────────────────────── */
const BlinkCursor = () => (
  <span className="inline-block w-2 h-4 bg-electric animate-blink ml-0.5 align-middle" aria-hidden="true" />
);

/* ── LIVE badge ───────────────────────────────────────────────────────────── */
const LiveBadge = () => (
  <div className="live-badge" role="status" aria-label="System online">
    <span className="w-2 h-2 rounded-full bg-neonRed animate-pulse-dot inline-block" />
    LIVE
  </div>
);

const Dashboard = () => {
  const { streak, highestImpactCategory, projectedAnnualTons, activities } = useCarbon();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 flex flex-col gap-8">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="animate-slide-up" style={{ animationFillMode: 'both' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: robot + title */}
          <div className="flex items-center gap-4">
            <AIRobot />
            <div>
              <h1
                className="text-4xl md:text-6xl font-black font-orbitron uppercase tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(0,255,135,0.4))',
                }}
              >
                CarbonTrace
              </h1>
              <p className="font-mono text-xs md:text-sm tracking-widest mt-1" style={{ color: '#00D4FF', opacity: 0.85 }}>
                [ AI CLIMATE COMMAND CENTER — SYSTEM ONLINE ]
                <BlinkCursor />
              </p>
            </div>
          </div>
          {/* Right: LIVE badge */}
          <div className="flex items-center gap-3">
            <LiveBadge />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px" style={{
          background: 'linear-gradient(90deg, transparent, #00D4FF44, #00D4FF, #00D4FF44, transparent)'
        }} aria-hidden="true" />
      </header>

      {/* ── PROGRESS STATS ─────────────────────────────────────────────── */}
      <section aria-label="Progress summary"
        className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <WeeklyProgress streak={streak} projectedTons={projectedAnnualTons} />
      </section>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* LEFT: Form + Suggestions */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
          <section aria-label="Log new activity"
            className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <ErrorBoundary>
              <ActivityForm />
            </ErrorBoundary>
          </section>
          <section aria-label="Personalised action suggestions"
            className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <ActionSuggestions highestImpactCategory={highestImpactCategory} />
          </section>
        </div>

        {/* RIGHT: Gauge + Power Bar + Export */}
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
          <section aria-label="Reactor core — carbon gauge"
            className="animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Suspense fallback={
              <div className="glass rounded-3xl h-96 flex items-center justify-center" role="status">
                <span className="font-mono text-sm text-cyan/60 animate-pulse">INITIALISING REACTOR CORE…</span>
              </div>
            }>
              <PlanetGauge projectedTons={projectedAnnualTons} />
            </Suspense>
          </section>

          <section aria-label="Planet power level"
            className="animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <PlanetPowerBar projectedTons={projectedAnnualTons} />
          </section>

          <section aria-label="Data export"
            className="animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <ExportPanel activities={activities} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
