import React from 'react';
import { CarbonProvider } from './context/CarbonContext';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

/* ── Floating Particles ──────────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size:  Math.random() * 3 + 1,
  top:   Math.random() * 100,
  left:  Math.random() * 100,
  dur:   (Math.random() * 8 + 4).toFixed(1),
  delay: (Math.random() * 6).toFixed(1),
  opacity: Math.random() * 0.4 + 0.1,
}));

/* ── Radar Sweep (bottom-right corner) ────────────────────────────────────── */
const RadarSweep = () => (
  <div
    className="fixed bottom-8 right-8 w-32 h-32 pointer-events-none z-0"
    aria-hidden="true"
    style={{ opacity: 0.18 }}
  >
    {/* Concentric circles */}
    {[32, 64, 96, 128].map(r => (
      <div key={r} className="absolute rounded-full border border-cyan/40"
        style={{ width: r, height: r, top: 64 - r/2, left: 64 - r/2 }} />
    ))}
    {/* Sweep line */}
    <div className="absolute inset-0 flex items-center justify-center animate-radar"
      style={{ transformOrigin: 'center' }}>
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '50%', height: '1px',
        transformOrigin: 'left center',
        background: 'linear-gradient(90deg, transparent, #00D4FF)',
      }} />
    </div>
    {/* Center dot */}
    <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan/80" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <CarbonProvider>
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#020917' }}>

          {/* ── Animated grid background ───────────────────────────────── */}
          <div className="fixed inset-0 grid-bg z-0 pointer-events-none" aria-hidden="true" />

          {/* ── Ambient glow blobs ─────────────────────────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.05) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '2s' }} />
            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, rgba(255,181,71,0.04) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '4s' }} />
          </div>

          {/* ── 20 floating particles ─────────────────────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            {PARTICLES.map(p => (
              <div key={p.id} className="particle" style={{
                width:  p.size,
                height: p.size,
                top:    `${p.top}%`,
                left:   `${p.left}%`,
                opacity: p.opacity,
                '--dur':   `${p.dur}s`,
                '--delay': `${p.delay}s`,
              }} />
            ))}
          </div>

          {/* ── Radar sweep ────────────────────────────────────────────── */}
          <RadarSweep />

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="relative z-10">
            <Dashboard />
          </div>
        </div>
      </CarbonProvider>
    </ErrorBoundary>
  );
}

export default App;
