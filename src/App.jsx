import React from 'react';
import { CarbonProvider } from './context/CarbonContext';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

/* ── Floating Particles ──────────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  size:  Math.random() * 3 + 1,
  top:   Math.random() * 100,
  left:  Math.random() * 100,
  dur:   (Math.random() * 8 + 4).toFixed(1),
  delay: (Math.random() * 6).toFixed(1),
  opacity: Math.random() * 0.4 + 0.1,
}));

/* ── CO₂ Molecule shapes (hexagons drifting upward) ──────────────────────── */
const CO2_MOLECULES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 12 + 8,
  dur: (Math.random() * 15 + 10).toFixed(1),
  delay: (Math.random() * 10).toFixed(1),
  opacity: Math.random() * 0.06 + 0.02,
}));

/* ── Matrix rain columns ─────────────────────────────────────────────────── */
const MATRIX_COLS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: (i / 15) * 100 + Math.random() * 5,
  chars: Array.from({ length: 8 }, () =>
    String.fromCharCode(0x30A0 + Math.random() * 96)),
  dur: (Math.random() * 8 + 6).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
}));

/* ── Radar Sweep (bottom-right corner) ────────────────────────────────────── */
const RadarSweep = () => (
  <div
    className="fixed bottom-8 right-8 w-32 h-32 pointer-events-none z-0"
    aria-hidden="true"
    style={{ opacity: 0.18 }}
  >
    {[32, 64, 96, 128].map(r => (
      <div key={r} className="absolute rounded-full border border-cyan/40"
        style={{ width: r, height: r, top: 64 - r/2, left: 64 - r/2 }} />
    ))}
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
    <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan/80"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <CarbonProvider>
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#020917' }}>

          {/* ── Animated grid background ───────────────────────────────── */}
          <div className="fixed inset-0 grid-bg z-0 pointer-events-none" aria-hidden="true" />

          {/* ── Aurora / Nebula waves ──────────────────────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute w-full h-full" style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 80%, rgba(0,255,135,0.06) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0,212,255,0.05) 0%, transparent 50%),
                radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,135,0.03) 0%, transparent 60%)
              `,
              animation: 'auroraMove 20s ease-in-out infinite alternate',
            }}/>
            <div className="absolute w-full h-full" style={{
              background: `
                radial-gradient(ellipse 50% 80% at 70% 70%, rgba(0,212,255,0.05) 0%, transparent 50%),
                radial-gradient(ellipse 80% 40% at 30% 30%, rgba(0,255,135,0.04) 0%, transparent 50%)
              `,
              animation: 'auroraMove 25s ease-in-out infinite alternate-reverse',
            }}/>
          </div>

          {/* ── Ambient glow blobs ─────────────────────────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.05) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '2s' }} />
          </div>

          {/* ── Matrix rain ────────────────────────────────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {MATRIX_COLS.map(col => (
              <div key={col.id} className="absolute text-center"
                style={{
                  left: `${col.left}%`,
                  top: '-20%',
                  fontSize: '10px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#00FF87',
                  opacity: 0.04,
                  writingMode: 'vertical-rl',
                  animation: `matrixFall ${col.dur}s linear infinite`,
                  animationDelay: `${col.delay}s`,
                  letterSpacing: '4px',
                }}>
                {col.chars.join('')}
              </div>
            ))}
          </div>

          {/* ── CO₂ Molecules (hexagons drifting up) ───────────────────── */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            {CO2_MOLECULES.map(m => (
              <div key={m.id} className="absolute"
                style={{
                  left: `${m.left}%`,
                  bottom: '-5%',
                  width: m.size,
                  height: m.size,
                  opacity: m.opacity,
                  border: '1px solid #00D4FF',
                  borderRadius: '30%',
                  transform: 'rotate(30deg)',
                  animation: `moleculeRise ${m.dur}s linear infinite`,
                  animationDelay: `${m.delay}s`,
                }}/>
            ))}
          </div>

          {/* ── Floating particles ─────────────────────────────────────── */}
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
