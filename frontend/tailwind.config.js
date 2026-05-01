/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ibm-blue': '#0f62fe',
        'ibm-teal': '#00bfa5',
        'ibm-purple': '#8a3ffc',
        'ibm-gray': '#161616',
        'ibm-light': '#f4f4f4',
      },
      fontFamily: {
        'ibm': ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

// Made with Bob
