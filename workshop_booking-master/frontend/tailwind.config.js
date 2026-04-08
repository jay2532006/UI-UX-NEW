/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'fossee-blue': '#003865',
        'fossee-orange': '#F7941D',
        'fossee-light': '#EEF4FB',
        'fossee-orange-dark': '#C06A00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
