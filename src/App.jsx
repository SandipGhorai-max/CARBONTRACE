import React from 'react';
import PropTypes from 'prop-types';
import { CarbonProvider } from './context/CarbonContext';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <CarbonProvider>
        <div className="min-h-screen selection:bg-electric/30 selection:text-electric relative overflow-hidden">
          {/* Animated ambient background blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan/10 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-electric/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="relative z-10">
            <Dashboard />
          </div>
        </div>
      </CarbonProvider>
    </ErrorBoundary>
  );
}

// App has no external props — no PropTypes required
export default App;
