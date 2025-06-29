/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/popup.html',
    './public/tab.html',
    './public/sidepanel.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './docs.html'
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'background-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'background-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-placeholder': 'rgb(var(--color-text-disabled) / <alpha-value>)',
        'accent-primary': 'rgb(var(--color-interactive-primary) / <alpha-value>)',
        'accent-primary-state': 'rgb(var(--color-interactive-primary-hover) / <alpha-value>)',
        'border-primary': 'rgb(var(--color-border-primary) / <alpha-value>)',
        'red': 'rgb(var(--color-status-error) / <alpha-value>)',
        'green': 'rgb(var(--color-status-success) / <alpha-value>)',
        'blue': 'rgb(var(--color-status-info) / <alpha-value>)',
        'yellow': 'rgb(var(--color-status-warning) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 