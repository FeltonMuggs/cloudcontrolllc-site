/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0c0d',
        surface: '#11161a',
        line: '#1d262b',
        ink: '#e9eff1',
        muted: '#8a999f',
        accent: '#34e3b0',
        accent2: '#22d3ee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
};
