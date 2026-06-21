import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';
import { trackEvent, startPerfTrace } from './services/firebase.analytics';

// Track app load as a Firebase Analytics event
trackEvent('app_loaded', {
  path: window.location.pathname,
  timestamp: new Date().toISOString(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
