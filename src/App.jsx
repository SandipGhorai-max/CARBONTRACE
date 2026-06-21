import React, { useState, Suspense } from 'react';
import { CarbonProvider } from './context/CarbonContext';
import { CarbonForm } from './components/CarbonForm';
import { CarbonSummary } from './components/CarbonSummary';
import { CarbonHistory } from './components/CarbonHistory';
import { AIInsight } from './components/AIInsight';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useCarbon } from './hooks/useCarbon';

// Lazy load Google Charts component
const CarbonChart = React.lazy(() => import('./components/CarbonChart').then(m => ({ default: m.CarbonChart })));

const DashboardLayout = () => {
  const [liveCo2, setLiveCo2] = useState(0);
  const { projectedAnnualTons } = useCarbon();

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-inter text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Carbon<span className="text-cyan-400">Trace</span></h1>
          <p className="text-slate-400 mt-1">Real-time footprint monitoring</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Input & Insights */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CarbonForm onLiveCo2Change={setLiveCo2} />
            <AIInsight projectedAnnualTons={projectedAnnualTons} />
          </div>

          {/* Middle Column - Summary & Chart */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CarbonSummary liveCo2={liveCo2} />
            <Suspense fallback={<div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg h-[300px] flex items-center justify-center text-cyan-400 animate-pulse">Loading Chart Engine...</div>}>
              <CarbonChart />
            </Suspense>
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-4 flex flex-col">
            <CarbonHistory />
          </div>

        </div>

      </div>
    </main>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <CarbonProvider>
        <DashboardLayout />
      </CarbonProvider>
    </ErrorBoundary>
  );
};


