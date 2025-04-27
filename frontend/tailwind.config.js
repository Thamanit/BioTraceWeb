/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pale-cashmere': '#E8DFD5',
        'noble-black': '#202124',
        'burning-orange': '#FF7124',
        'cinnamon-ice': '#DBBAA7',
        'blue-estate': '#3B4883',
        'wahoo': '#272D4E',
      },
    },
  },
  plugins: [],
}
