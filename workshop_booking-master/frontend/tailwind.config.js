/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // MASTER_PROMPT Section 3 — Design System Color Tokens
        fossee: {
          primary:   '#1A56DB',   // CTAs, links, active states
          secondary: '#0E9F6E',   // Success, accepted status
          accent:    '#E3A008',   // Warning, pending status
          danger:    '#E02424',   // Rejected, delete actions
          surface:   '#F9FAFB',   // Page background
          card:      '#FFFFFF',   // Card background
          border:    '#E5E7EB',   // Default border
          muted:     '#6B7280',   // Secondary text
          dark:      '#111827',   // Headings
        },
        // Legacy aliases — keeps existing components working during migration
        'fossee-blue': '#1A56DB',
        'fossee-orange': '#E3A008',
        'fossee-light': '#F9FAFB',
        'fossee-orange-dark': '#C06A00',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // MASTER_PROMPT Section 3 — Custom shadow levels
        'card':  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
