/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0C',
          900: '#0B0B0C',
          800: '#141416',
          700: '#1C1C1F',
          600: '#262629',
          500: '#34343A',
          400: '#4A4A52',
          300: '#6B6B74',
        },
        bone: {
          DEFAULT: '#EFE9DD',
          100: '#FBF8F2',
          200: '#EFE9DD',
          300: '#D8D1C2',
          400: '#B3AC9D',
          500: '#8A8478',
        },
        blood: {
          DEFAULT: '#E11D2E',
          dim: '#9E1320',
          glow: '#FF3B4B',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        slab: '0.18em',
        wider2: '0.28em',
      },
      boxShadow: {
        stamp: '0 0 0 2px #E11D2E, 0 12px 40px rgba(225,29,46,0.25)',
        spot: '0 30px 120px rgba(0,0,0,0.85)',
      },
      keyframes: {
        spotlightDrift: {
          '0%': { transform: 'translate(-12%, -8%) scale(1.05)' },
          '50%': { transform: 'translate(10%, 6%) scale(1.12)' },
          '100%': { transform: 'translate(-12%, -8%) scale(1.05)' },
        },
        grainFlicker: {
          '0%, 100%': { opacity: '0.06', transform: 'translate(0,0)' },
          '20%': { opacity: '0.09', transform: 'translate(-1%, 1%)' },
          '40%': { opacity: '0.05', transform: 'translate(1%, -1%)' },
          '60%': { opacity: '0.08', transform: 'translate(-1%, -1%)' },
          '80%': { opacity: '0.06', transform: 'translate(1%, 1%)' },
        },
        stampSlam: {
          '0%': { transform: 'scale(2.4) rotate(-14deg)', opacity: '0' },
          '55%': { transform: 'scale(0.86) rotate(-9deg)', opacity: '1' },
          '70%': { transform: 'scale(1.06) rotate(-7deg)' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        suspicionFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill, 0%)' },
        },
        eyeScan: {
          '0%, 100%': { transform: 'translateX(-14%)' },
          '50%': { transform: 'translateX(14%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.78' },
          '50%': { opacity: '0.4' },
          '55%': { opacity: '0.85' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        spotlight: 'spotlightDrift 18s ease-in-out infinite',
        grain: 'grainFlicker 1.2s steps(3) infinite',
        stamp: 'stampSlam 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards',
        suspicion: 'suspicionFill 1.1s ease-out forwards',
        eye: 'eyeScan 4.5s ease-in-out infinite',
        flicker: 'flicker 3.2s ease-in-out infinite',
        dot: 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
