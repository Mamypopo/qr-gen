/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          light: '#f5f5f7',
          dark: '#1d1d1f',
        },
        surface: {
          light: '#ffffff',
          dark: '#2d2d2d',
        },
        border: {
          light: '#d2d2d7',
          dark: '#38383a',
        },
      },
    },
  },
  plugins: [],
}