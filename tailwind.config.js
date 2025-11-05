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
          light: '#fafafa',
          dark: '#0a0a0a',
        },
        surface: {
          light: '#ffffff',
          dark: '#141414',
        },
        border: {
          light: '#e5e5e5',
          dark: '#262626',
        },
      },
    },
  },
  plugins: [],
}