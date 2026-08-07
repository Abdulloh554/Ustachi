import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.8125rem',
        base: '0.9375rem',
        lg: '1rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.875rem',
        '4xl': '2rem',
        '5xl': '2.25rem',
        '6xl': '2.5rem',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-light': 'var(--text-light)',
        danger: 'var(--danger)',
        'danger-hover': 'var(--danger-hover)',
        success: 'var(--success)',
        'success-hover': 'var(--success-hover)',
        warning: 'var(--warning)',
        'warning-hover': 'var(--warning-hover)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-1px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-up': 'fadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pop-in': 'popIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'shake': 'shake 300ms cubic-bezier(0.65, 0, 0.35, 1) both',
      },
    },
  },
  plugins: [],
}
export default config
