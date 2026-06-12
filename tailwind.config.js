/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: '#080B14',
        electric: '#00FF87',
        cyan: '#00D4FF',
        coral: '#FF4D6D',
        amber: '#FFB547',
        card: '#111827',
        cardBorder: '#1F2937'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(0, 212, 255, 0.5)',
        'neon-green': '0 0 15px rgba(0, 255, 135, 0.5)',
        'neon-coral': '0 0 15px rgba(255, 77, 109, 0.5)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}
