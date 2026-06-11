/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yt-red': '#FF0000',
        'yt-dark': '#0f0f0f',
        'yt-gray': '#272727',
        'yt-light-gray': '#3f3f3f',
        'yt-text': '#f1f1f1',
        'yt-text-secondary': '#aaaaaa',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
