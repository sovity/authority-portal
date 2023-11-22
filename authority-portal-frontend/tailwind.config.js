/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'brand-400': '#FFEE00',
        'brand-500': '#FFC000',
        'brand-yellow': '#FFFE00',
        'brand-black': '#000000',
        'brand-golden': '#BD7D00',
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
  plugins: [],
};
