/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F4C81', light: '#1C6EA4', hover: '#1a5a96' },
        surface: { app: '#F8FAFC', card: '#FFFFFF', column: '#F1F5F9' },
        border: { DEFAULT: '#E2E8F0' },
        ink: { primary: '#0F172A', secondary: '#94A3B8' },
        status: {
          todo: '#94A3B8',
          inprogress: '#F59E0B',
          inreview: '#EF4444',
          done: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '12px', btn: '8px' },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'card-drag': '0 12px 32px rgba(0,0,0,0.16), 0 4px 8px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-slide-in': 'fadeSlideIn 0.3s ease forwards',
        'card-settle': 'cardSettle 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        shimmer: 'shimmer 1.6s infinite linear',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'step-in': 'stepIn 0.3s ease forwards',
        'step-out': 'stepOut 0.25s ease forwards',
        'pulse-cta': 'pulseCta 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardSettle: {
          '0%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        stepIn: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        stepOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-24px)' },
        },
        pulseCta: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
