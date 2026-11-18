/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        ink: { DEFAULT: '#121815', muted: '#5E6A64' },
        paper: '#F7F5EF',
        surface: '#FFFFFF',
        line: '#E6E2D8',
        forest: { 900: '#0F3B2C', 700: '#1E5A43', 500: '#3C7D61', 100: '#E2EEE7' },
        marigold: { DEFAULT: '#E9A23B', 100: '#FBEFD9', 600: '#D68E26' },
        swap: { DEFAULT: '#3E5C8A', 100: '#E3EAF4' },
        repair: { DEFAULT: '#B65A35', 100: '#F6E4DA' },
        success: '#2E7D4F',
        warning: '#B7791F',
        error: '#B42318',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: { site: '1200px' },
      borderRadius: { card: '12px' },
      boxShadow: {
        soft: '0 1px 2px rgba(18,24,21,0.04), 0 4px 16px rgba(18,24,21,0.05)',
        lift: '0 2px 4px rgba(18,24,21,0.04), 0 12px 32px rgba(18,24,21,0.09)',
      },
      letterSpacing: { tightest: '-0.035em' },
    },
  },
  plugins: [],
};
