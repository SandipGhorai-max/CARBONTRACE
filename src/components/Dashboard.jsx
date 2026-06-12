import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { useCarbon } from '../hooks/useCarbon';
import ActivityForm from './ActivityForm';
import ActionSuggestions from './ActionSuggestions';
import WeeklyProgress from './WeeklyProgress';
import ExportPanel from './ExportPanel';
import ErrorBoundary from './ErrorBoundary';

// Lazy load the gauge for performance — it uses heavier SVG rendering
const PlanetGauge = lazy(() => import('./PlanetGauge'));

const Dashboard = () => {
  const { streak, highestImpactCategory, projectedAnnualTons, activities } = useCarbon();

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8 md:gap-10 animate-slide-up">
      {/* Page header — single h1 per page */}
      <header className="mb-2 mt-4 md:mt-8 flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-electric to-cyan drop-shadow-neon uppercase">
          CarbonTrace
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide font-inter">
          Track, understand, and reduce your personal carbon footprint.
        </p>
      </header>

      {/* Progress & Stats */}
      <section
        aria-label="Progress summary"
        className="animate-slide-up"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        <WeeklyProgress streak={streak} projectedTons={projectedAnnualTons} />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

        {/* Left Column: Form & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10">
          <section
            aria-label="Log new activity"
            className="animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <ErrorBoundary>
              <ActivityForm />
            </ErrorBoundary>
          </section>

          <section
            aria-label="Personalised action suggestions"
            className="animate-slide-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <ActionSuggestions highestImpactCategory={highestImpactCategory} />
          </section>
        </div>

        {/* Right Column: Gauge & Export */}
        <div className="lg:col-span-5 flex flex-col gap-8 md:gap-10">
          <section
            aria-label="Carbon footprint gauge"
            className="flex justify-center w-full animate-slide-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Suspense
              fallback={
                <div
                  className="h-[400px] w-full glass animate-pulse rounded-3xl border border-cardBorder flex items-center justify-center"
                  aria-label="Loading carbon footprint gauge"
                  role="status"
                >
                  <span className="text-gray-500 font-inter text-sm">Loading gauge…</span>
                </div>
              }
            >
              <PlanetGauge projectedTons={projectedAnnualTons} />
            </Suspense>
          </section>

          <section
            aria-label="Data export"
            className="animate-slide-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <ExportPanel activities={activities} />
          </section>
        </div>

      </div>
    </main>
  );
};

// Dashboard has no external props — receives all data via context
Dashboard.propTypes = {};

export default Dashboard;
