/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          50: '#E8F5E8',
          100: '#C8E6C9',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#1B5E20',
        },
        'earth': {
          50: '#EFEBE9',
          100: '#D7CCC8',
          500: '#5D4037',
          600: '#4E342E',
          700: '#3E2723',
        },
        'amber': {
          50: '#FFF8E1',
          100: '#FFECB3',
          500: '#FF6F00',
          600: '#E65100',
          700: '#BF360C',
        },
        'surface': '#FAFAFA',
        'background': '#F5F5F5',
      },
      fontFamily: {
        'display': ['DM Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'card': '8px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}