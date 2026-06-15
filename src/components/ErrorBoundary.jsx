import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary — Class component that catches runtime errors in the component
 * tree and renders a graceful fallback UI instead of a blank screen.
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <ComponentThatMightCrash />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a production app this would ship to an error monitoring service (e.g. Sentry)
    console.error('[CarbonTrace] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-space flex items-center justify-center p-8"
        >
          <div className="glass p-8 rounded-3xl max-w-lg w-full text-center flex flex-col gap-6">
            <div className="text-6xl" aria-hidden="true">⚠️</div>
            <h1 className="text-2xl font-black font-orbitron text-coral">
              System Error Detected
            </h1>
            <p className="text-gray-400 leading-relaxed font-inter">
              An unexpected error occurred. Your locally saved data is safe.
              Click below to reload the application.
            </p>
            {this.state.error && (
              <details className="text-left">
                <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-coral/70 bg-coral/5 p-3 rounded-lg overflow-auto border border-coral/20">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="mt-2 bg-gradient-to-r from-electric to-cyan text-space font-bold font-orbitron py-3 px-8 rounded-xl hover:shadow-neon hover:scale-[1.02] transition-all active:scale-[0.98]"
              aria-label="Reload CarbonTrace application"
            >
              RELOAD APP
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child component tree to render and guard against runtime errors. */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
