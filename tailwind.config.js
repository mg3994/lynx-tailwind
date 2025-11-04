/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('@lynx-js/tailwind-preset-canary')],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS custom properties
        theme: {
          primary: 'hsl(var(--primary-hsl) / <alpha-value>)',
          'primary-light': 'hsl(var(--primary-light-hsl) / <alpha-value>)',
          'primary-dark': 'hsl(var(--primary-dark-hsl) / <alpha-value>)',
          secondary: 'hsl(var(--secondary-hsl) / <alpha-value>)',
          accent: 'hsl(var(--accent-hsl) / <alpha-value>)',
          background: 'hsl(var(--background-hsl) / <alpha-value>)',
          surface: 'hsl(var(--surface-hsl) / <alpha-value>)',
          text: 'hsl(var(--text-hsl) / <alpha-value>)',
          'text-secondary': 'hsl(var(--text-secondary-hsl) / <alpha-value>)',
        },
        // Semantic color aliases for easier usage
        primary: 'hsl(var(--primary-hsl) / <alpha-value>)',
        secondary: 'hsl(var(--secondary-hsl) / <alpha-value>)',
        accent: 'hsl(var(--accent-hsl) / <alpha-value>)',
      },
      backgroundColor: {
        theme: 'hsl(var(--background-hsl) / <alpha-value>)',
        surface: 'hsl(var(--surface-hsl) / <alpha-value>)',
      },
      textColor: {
        theme: 'hsl(var(--text-hsl) / <alpha-value>)',
        'theme-secondary': 'hsl(var(--text-secondary-hsl) / <alpha-value>)',
      },
      borderColor: {
        theme: 'hsl(var(--primary-hsl) / <alpha-value>)',
        surface: 'hsl(var(--surface-hsl) / <alpha-value>)',
      },
      transitionProperty: {
        theme: 'background-color, border-color, color, fill, stroke, opacity',
      },
      transitionDuration: {
        theme: 'var(--theme-transition-duration)',
      },
    },
  },
  plugins: [],
  // Configure dark mode using data attribute
  darkMode: ['class', '[data-theme="dark"]'],
};