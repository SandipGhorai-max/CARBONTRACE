import React, { Component } from 'react';
import { ErrorBoundaryProps } from '../../types/propTypes';

/**
 * ErrorBoundary component to catch rendering errors in child components.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Deliberately empty per audit requirements (no console.error in production)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 p-8 rounded-xl max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl" aria-hidden="true">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-widest">System Failure</h1>
            <p className="text-slate-400 mb-6 text-sm">
              The interface encountered an unexpected error and needs to be reinitialized.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-slate-700"
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = ErrorBoundaryProps;
