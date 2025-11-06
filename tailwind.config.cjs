/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff7b54',
        secondary: '#3c6e71',
        accent: '#f9c74f',
        dark: '#1d1e2c'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(0,0,0,0.15)'
      }
    }
  },
  plugins: []
};
