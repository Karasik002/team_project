/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f9ff',
          100: '#dcedff',
          200: '#b7dbff',
          300: '#82c1ff',
          400: '#429eff',
          500: '#1c7dff',
          600: '#0f5ff5',
          700: '#0e49c4',
          800: '#123d95',
          900: '#133677',
        },
      },
      boxShadow: {
        glow: '0 10px 30px -12px rgba(28, 125, 255, 0.6)',
      },
    },
  },
  plugins: [],
}

