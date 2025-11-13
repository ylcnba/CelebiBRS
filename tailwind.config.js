/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tav-orange': '#FF6B35',
        'tav-blue': '#004E89',
        'celebi-blue': '#003366',
      },
    },
  },
  plugins: [],
}


