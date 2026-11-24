/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        quest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        ocean: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        sun: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        grime: {
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        glow: '0 0 24px -2px rgba(16, 185, 129, 0.55)',
        'glow-lg': '0 0 48px -4px rgba(16, 185, 129, 0.6)',
        soft: '0 10px 30px -12px rgba(2, 44, 34, 0.35)',
        card: '0 8px 24px -10px rgba(15, 23, 42, 0.25)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.08)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: 0 },
          '70%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: 0.6 },
          '100%': { transform: 'scale(2.4)', opacity: 0 },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rise: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-70px)', opacity: 0 },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        pop: 'pop 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        slideUp: 'slideUp 0.4s ease-out forwards',
        shimmer: 'shimmer 1.4s linear infinite',
        ripple: 'ripple 1.8s ease-out infinite',
        spinSlow: 'spinSlow 1.2s linear infinite',
        rise: 'rise 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
