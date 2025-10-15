/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/index.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        neutral: {
          DEFAULT: 'var(--color-neutral)',
          light: 'var(--color-neutral-light)',
          dark: 'var(--color-neutral-dark)',
          darker: 'var(--color-neutral-darker)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': 'var(--shadow-lg)',
        'card-hover': 'var(--shadow-xl)',
        'glow': 'var(--shadow-glow)',
      }
    },
  },
  plugins: [],
}
