/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        cream: '#FFF7ED',
        ink: '#0F172A',
        mist: '#F8FAFC',
        amberx: '#F59E0B',
        rosex: '#F43F5E',
        skyx: '#38BDF8',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 118, 110, 0.08)',
        glow: '0 0 0 6px rgba(20, 184, 166, 0.12)',
        card: '0 4px 20px rgba(15, 23, 42, 0.06)',
      },
      backgroundImage: {
        'topo-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2314b8a6' stroke-opacity='0.08' stroke-width='1'%3E%3Cpath d='M0 40 Q20 20 40 40 T80 40' /%3E%3Cpath d='M0 60 Q20 40 40 60 T80 60' /%3E%3Cpath d='M0 20 Q20 0 40 20 T80 20' /%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
