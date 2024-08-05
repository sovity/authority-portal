/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  theme: {
    extend: {
      colors: {
        'brand-400': 'rgb(var(--color-brand-400) / <alpha-value>)',
        'brand-500': 'rgb(var(--color-brand-500) / <alpha-value>)',
        'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'brand-black': 'rgb(var(--color-brand-black) / <alpha-value>)',
        'brand-highlight': 'rgb(var(--color-brand-highlight) / <alpha-value>)',
        'sidebar-color': 'rgb(var(--color-sidebar-bg) / <alpha-value>)',
        'sidebar-selected-color':
          'rgb(var(--color-sidebar-selected) / <alpha-value>)',
        'sidebar-text-color': 'rgb(var(--color-sidebar-text) / <alpha-value>)',
        'sidebar-text-selected-color':
          'rgb(var(--color-sidebar-text-selected) / <alpha-value>)',
        'sidebar-section-color':
          'rgb(var(--color-sidebar-section) / <alpha-value>)',
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
