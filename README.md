# CarbonTrace

CarbonTrace is a personal carbon footprint tracker built with React and Tailwind CSS. It focuses on privacy, performance, and accessibility, providing users with a beautiful interface to track their daily activities and measure their impact against the Paris Agreement targets.

## Features
- **Offline First**: Zero external API calls after initial load. All data is securely stored in your browser's `localStorage`.
- **Performance**: Built with `useMemo`, `useCallback`, and `React.lazy` for a targeted 90+ Lighthouse score.
- **Accessibility**: Strict WCAG 2.1 AA compliance with semantic HTML, comprehensive ARIA labeling, and keyboard navigability.
- **Data Portability**: Export your data at any time in CSV or JSON formats.

## Setup & Installation

To run this project locally, ensure you have Node.js installed, then execute:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run unit tests
npm test
```

## Design Decisions
- **Tailwind CSS**: Used exclusively for styling to keep bundle sizes small and maintain a strict design system without custom CSS files.
- **Context API + useReducer**: Opted for native React state management instead of Redux or Zustand, as the state shape is simple enough and it reduces external dependencies.
- **Custom SVG Gauge**: Built a custom planet budget gauge using plain SVG rather than importing a heavy charting library like Recharts. This ensures maximum control over accessibility and maintains a very small bundle size.
- **Vitest over Jest**: Integrated Vitest for testing. It is API-compatible with Jest but runs significantly faster within the Vite ecosystem.

## Known Limitations
- The "Current Streak" logic is currently a simplified version that calculates consecutive days based purely on the `lastLoginDate`. A more robust implementation would check for activities logged on consecutive days rather than just logins.
- Carbon factors are static estimates based on general averages (e.g., EPA, Our World in Data) and may not account for regional variations in energy grids or specific vehicle models.
