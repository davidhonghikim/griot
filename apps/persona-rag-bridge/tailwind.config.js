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
        // Background colors
        'background-primary': 'rgb(var(--color-bg-primary))',
        'background-secondary': 'rgb(var(--color-bg-secondary))',
        'background-tertiary': 'rgb(var(--color-bg-tertiary))',
        'background-accent': 'rgb(var(--color-bg-accent))',
        'background-surface': 'rgb(var(--color-bg-surface))',
        'background-overlay': 'rgb(var(--color-bg-overlay))',
        
        // Text colors
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
        'text-tertiary': 'rgb(var(--color-text-tertiary))',
        'text-disabled': 'rgb(var(--color-text-disabled))',
        'text-inverse': 'rgb(var(--color-text-inverse))',
        'text-accent': 'rgb(var(--color-text-accent))',
        
        // Border colors
        'border-primary': 'rgb(var(--color-border-primary))',
        'border-secondary': 'rgb(var(--color-border-secondary))',
        'border-accent': 'rgb(var(--color-border-accent))',
        'border-focus': 'rgb(var(--color-border-focus))',
        
        // Status colors
        'status-success': 'rgb(var(--color-status-success))',
        'status-warning': 'rgb(var(--color-status-warning))',
        'status-error': 'rgb(var(--color-status-error))',
        'status-info': 'rgb(var(--color-status-info))',
        
        // Interactive colors
        'interactive-primary': 'rgb(var(--color-interactive-primary))',
        'interactive-primary-hover': 'rgb(var(--color-interactive-primary-hover))',
        'interactive-primary-active': 'rgb(var(--color-interactive-primary-active))',
        'interactive-secondary': 'rgb(var(--color-interactive-secondary))',
        'interactive-secondary-hover': 'rgb(var(--color-interactive-secondary-hover))',
        'interactive-secondary-active': 'rgb(var(--color-interactive-secondary-active))',
      },
      boxShadow: {
        'small': 'var(--shadow-small)',
        'medium': 'var(--shadow-medium)',
        'large': 'var(--shadow-large)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        'xxl': 'var(--spacing-xxl)',
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        'xxl': 'var(--font-size-xxl)',
        'xxxl': 'var(--font-size-xxxl)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 