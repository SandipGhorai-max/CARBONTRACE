# CarbonTrace

CarbonTrace is a personal carbon footprint tracker built with React, Tailwind CSS, and Firebase. It provides a stunning, accessible interface to track daily activities and measure their impact against Paris Agreement targets.

## Features

- 🔥 **Firebase Integration**: Cloud sync via Firebase Realtime Database + Analytics event tracking
- 📡 **Offline Resilient**: Falls back to `localStorage` if Firebase is unavailable — zero data loss
- ♿ **Accessibility**: WCAG 2.1 AA compliant — ARIA labels, keyboard navigation, focus rings, error associations
- 🚀 **Performance**: React.lazy, useMemo, useCallback, memoised components for optimal rendering
- 🔒 **Secure**: Content-Security-Policy meta tag, nginx security headers, URL revocation, non-root Docker user
- 📊 **Data Portability**: Export data as CSV or JSON with automatic URL revocation (no memory leaks)
- 🛡️ **Error Resilient**: ErrorBoundary on all critical sections with graceful fallback UI
- ✅ **Tested**: 40+ tests across unit, integration, and component levels

## Architecture

| Layer | Technology |
|---|---|
| UI Framework | React 18 with StrictMode |
| Styling | Tailwind CSS v3 (custom design system) |
| State | Context API + useReducer |
| Cloud Sync | Firebase Realtime Database |
| Analytics | Firebase Analytics (GA4) |
| Testing | Vitest + @testing-library/react |
| Build | Vite 5 |
| Deploy | Google Cloud Run (via Cloud Build) |
| Serve | Nginx (alpine, non-root) |

## Setup & Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and add your Firebase config
cp .env.example .env

# 3. Start the development server
npm run dev

# 4. Run all tests
npm test

# 5. Run tests with coverage report
npm run test:coverage
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Realtime Database** and **Analytics**
3. Copy your config values into `.env` (see `.env.example`)

> **Note:** Firebase client keys are intentionally public — they are secured by Firebase Security Rules, not kept secret.

## Deployment (Google Cloud Run)

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com

# Build & test in Cloud Build, then deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/carbontrace .
gcloud run deploy carbontrace \
  --image gcr.io/YOUR_PROJECT_ID/carbontrace \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## Design Decisions

- **Firebase with localStorage fallback**: Cloud sync improves cross-device experience while guaranteeing offline resilience
- **ErrorBoundary**: Class component wrapping critical sections so a crash in one widget never takes down the whole app
- **URL.revokeObjectURL**: Called immediately after every file download to prevent memory leaks
- **isFinite() guard**: `formatNumber` uses `isFinite()` instead of `isNaN()` alone — catches Infinity and -Infinity
- **Math.round for day diff**: Streak calculation uses `Math.round` (not `Math.ceil`) to handle timezone boundary edge cases
- **Vitest over Jest**: Runs significantly faster in the Vite ecosystem; API-compatible for easy migration
