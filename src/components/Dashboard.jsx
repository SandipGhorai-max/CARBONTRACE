import React, { Suspense, lazy, useState } from 'react';
import { useCarbon } from '../hooks/useCarbon';
import { useSoundEngine } from '../hooks/useSoundEngine';
import ActivityForm from './ActivityForm';
import ActionSuggestions from './ActionSuggestions';
import WeeklyProgress from './WeeklyProgress';
import ExportPanel from './ExportPanel';
import PlanetPowerBar from './PlanetPowerBar';
import NeuralNetworkCard from './NeuralNetworkCard';
import OptimizationProtocols from './OptimizationProtocols';
import MissionDebrief from './MissionDebrief';
import AIRobot from './AIRobot';
import HolographicGlobe from './HolographicGlobe';
import ErrorBoundary from './ErrorBoundary';
import { Volume2, VolumeX } from 'lucide-react';

const PlanetGauge = lazy(() => import('./PlanetGauge'));

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
  const { muted, toggleMute, playBeep } = useSoundEngine();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataTransmit = () => {
    setIsProcessing(true);
    playBeep();
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 flex flex-col gap-8">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="animate-slide-up" style={{ animationFillMode: 'both' }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left: robot + title */}
          <div className="flex items-start gap-4">
            <AIRobot co2Tons={projectedAnnualTons} isProcessing={isProcessing} />
            <div className="pt-2" style={{ marginLeft: '14rem' }}>
              <h1
                className="text-4xl md:text-6xl font-black font-orbitron uppercase tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(0,255,135,0.4))',
                  textShadow: '0 0 20px currentColor',
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
          {/* Right: Globe + LIVE + Mute */}
          <div className="flex items-center gap-3">
            <HolographicGlobe co2Tons={projectedAnnualTons} />
            <LiveBadge />
            <button onClick={toggleMute}
              className="p-2 rounded-lg border transition-all"
              style={{
                background: 'rgba(10,22,40,0.8)',
                borderColor: muted ? '#1A3A5C' : '#00FF8744',
                color: muted ? '#4A7A9B' : '#00FF87',
              }}
              aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>
              {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
            </button>
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

        {/* LEFT: Form + Protocols + Suggestions */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
          <section aria-label="Log new activity"
            className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <ErrorBoundary>
              <ActivityForm onTransmit={handleDataTransmit} />
            </ErrorBoundary>
          </section>

          <section aria-label="AI Optimization Protocols"
            className="animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <OptimizationProtocols />
          </section>

          <section aria-label="Personalised action suggestions"
            className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <ActionSuggestions highestImpactCategory={highestImpactCategory} />
          </section>
        </div>

        {/* RIGHT: Gauge + Neural Network + Power Bar + Export */}
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

          <section aria-label="AI Neural Network Status"
            className="animate-slide-up" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
            <NeuralNetworkCard />
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

      {/* ── MISSION DEBRIEF (full width) ───────────────────────────────── */}
      <section aria-label="Mission Debrief"
        className="animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <MissionDebrief activities={activities} />
      </section>
    </main>
  );
};

export default Dashboard;
