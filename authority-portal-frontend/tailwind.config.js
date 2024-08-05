/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  theme: {
    extend: {
      colors: {
        'brand-400': 'var(--color-brand-400)',
        'brand-500': 'var(--color-brand-500)',
        'brand-yellow': 'var(--color-brand-yellow)',
        'brand-black': 'var(--color-brand-black)',
        'brand-golden': 'var(--color-brand-golden)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
        showNotification: 'showNotification 5s',
      },
      keyframes: {
        showNotification: {
          '0%': {opacity: '0'},
          '10%': {opacity: '1'},
          '90%': {opacity: '1'},
          '100%': {opacity: '0'},
        },
        fadeIn: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
        fadeOut: {
          '0%': {opacity: '1'},
          '100%': {opacity: '0'},
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],
};
