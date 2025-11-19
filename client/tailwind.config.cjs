/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // "Authority" - Dark, professional backgrounds
        govt: {
          900: '#0B1120', // Almost black navy
          800: '#0F172A', // Deep slate
          700: '#1E293B', // Card backgrounds
        },
        // "Verification" - The trust signal
        verifi: {
          success: '#059669', // Emerald 600
          glow: '#34D399',    // Emerald 400 (for accents)
          error: '#DC2626',   // Red 600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Keep Inter, it's professional
        mono: ['JetBrains Mono', 'monospace'], // For Batch Numbers
      },
      animation: {
        'scan-line': 'scan 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
};
