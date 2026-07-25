/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bh: {
          black: '#0B0B0C',
          ink: '#151517',
          charcoal: '#1E1E20',
          white: '#FFFFFF',
          ivory: '#F6F3EC',
          grey: '#8A8A8E',
          line: 'rgba(184,147,90,0.22)',
          gold: {
            DEFAULT: '#B8935A',
            bright: '#D8B378',
            dim: '#8C7148',
          },
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tag: '0.22em',
      },
      backgroundImage: {
        'gold-fade': 'linear-gradient(90deg, transparent, rgba(184,147,90,0.55), transparent)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        fadeUp: 'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
};
