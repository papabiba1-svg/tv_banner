/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEFA',
          100: '#FDFBF2',
          DEFAULT: '#F9F6E8',
          200: '#F2EED6',
          300: '#E7E1BF',
          400: '#D9D1A3',
        },
        mta: {
          green: {
            light: '#007533',
            DEFAULT: '#005826',
            dark: '#00421C',
            darker: '#002E13',
          },
          yellow: {
            light: '#FFD738',
            DEFAULT: '#F4C414',
            dark: '#D9AB07',
          },
          cream: '#F9F6E8',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tv-card': '0 20px 50px rgba(0, 46, 19, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06)',
        'tv-plate': '0 30px 60px -15px rgba(0, 46, 19, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.15)',
        'tv-badge': '0 8px 25px rgba(244, 196, 20, 0.4)',
        'tv-green': '0 8px 25px rgba(0, 88, 38, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

