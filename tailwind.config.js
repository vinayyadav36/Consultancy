/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        accent: {
          DEFAULT: '#00ff95',
          dark: '#00cc78',
        }
      },
      backgroundColor: {
        dark: '#0f0f0f',
      }
    },
  },
  plugins: [],
};