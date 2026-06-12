/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space:      '#020917',
        spaceMid:   '#0A1628',
        spaceCard:  'rgba(10, 22, 40, 0.85)',
        electric:   '#00FF87',
        cyan:       '#00D4FF',
        coral:      '#FF4D6D',
        amber:      '#FFB547',
        card:       '#0A1628',
        cardBorder: '#1A3A5C',
        neonGreen:  '#00FF87',
        neonCyan:   '#00D4FF',
        neonRed:    '#FF2D55',
      },
      fontFamily: {
        inter:    ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon:         '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)',
        'neon-green': '0 0 20px rgba(0,255,135,0.5), 0 0 40px rgba(0,255,135,0.2)',
        'neon-amber': '0 0 20px rgba(255,181,71,0.5), 0 0 40px rgba(255,181,71,0.2)',
        'neon-coral': '0 0 20px rgba(255,77,109,0.5), 0 0 40px rgba(255,77,109,0.2)',
        'neon-sm':    '0 0 10px rgba(0,212,255,0.4)',
        'card-glow':  '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'shimmer':        'shimmer 2.5s linear infinite',
        'slide-up':       'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':     'pulseSlow 4s ease-in-out infinite',
        'pulse-dot':      'pulseDot 1.5s ease-in-out infinite',
        'blink':          'blink 1.1s step-end infinite',
        'count-up':       'countUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        'scan':           'scan 8s linear infinite',
        'orbit':          'orbit 8s linear infinite',
        'orbit-reverse':  'orbitReverse 12s linear infinite',
        'radar':          'radar 4s linear infinite',
        'flicker':        'flicker 0.4s ease-out forwards',
        'float':          'float 6s ease-in-out infinite',
        'gauge-glow':     'gaugeGlow 3s ease-in-out infinite',
        'tick-rotate':    'tickRotate 20s linear infinite',
        'power-fill':     'powerFill 1.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'eyes-pulse':     'eyesPulse 2s ease-in-out infinite',
        'grid-move':      'gridMove 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%,100%': { opacity: 0.3 },
          '50%':     { opacity: 0.8 },
        },
        pulseDot: {
          '0%,100%': { opacity: 1,   transform: 'scale(1)' },
          '50%':     { opacity: 0.3, transform: 'scale(0.7)' },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0 },
        },
        scan: {
          '0%':   { top: '-4px', opacity: 0 },
          '5%':   { opacity: 1 },
          '95%':  { opacity: 1 },
          '100%': { top: '100%', opacity: 0 },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbitReverse: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        radar: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flicker: {
          '0%':   { opacity: 0 },
          '10%':  { opacity: 1 },
          '12%':  { opacity: 0 },
          '14%':  { opacity: 1 },
          '20%':  { opacity: 0.4 },
          '25%':  { opacity: 1 },
          '30%':  { opacity: 0.3 },
          '35%':  { opacity: 1 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)'  },
          '50%':     { transform: 'translateY(-20px)' },
        },
        gaugeGlow: {
          '0%,100%': { filter: 'drop-shadow(0 0 8px #00FF87)  drop-shadow(0 0 16px #00FF8766)' },
          '50%':     { filter: 'drop-shadow(0 0 18px #00FF87) drop-shadow(0 0 36px #00FF8799)' },
        },
        tickRotate: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        powerFill: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--power-width)' },
        },
        eyesPulse: {
          '0%,100%': { boxShadow: '0 0 6px #00FF87, 0 0 12px #00FF87' },
          '50%':     { boxShadow: '0 0 12px #00FF87, 0 0 24px #00FF87, 0 0 36px #00FF8766' },
        },
        gridMove: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
      },
    },
  },
  plugins: [],
}
