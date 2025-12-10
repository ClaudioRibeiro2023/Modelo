/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #0087A8)',
          secondary: 'var(--brand-secondary, #005F73)',
          accent: 'var(--brand-accent, #94D2BD)',
        },
        surface: {
          base: 'var(--surface-base, #F8FAFC)',
          elevated: 'var(--surface-elevated, #FFFFFF)',
          muted: 'var(--surface-muted, #F1F5F9)',
        },
        text: {
          primary: 'var(--text-primary, #0F172A)',
          secondary: 'var(--text-secondary, #475569)',
          muted: 'var(--text-muted, #94A3B8)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
