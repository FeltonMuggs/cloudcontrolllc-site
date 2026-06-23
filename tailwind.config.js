/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#11314f',
        'navy-deep': '#0b2237',
        'navy-900': '#081a2b',
        sky: '#5a9bd4',
        'sky-light': '#a9cde8',
        'sky-pale': '#dcebf7',
        field: '#5ea049',
        'field-deep': '#3c7a31',
        wheat: '#d8a93f',
        'wheat-light': '#ecc873',
        cream: '#f5f2ea',
        'cream-2': '#ece6d8',
        ink: '#0e2233',
        'ink-soft': '#42627d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
