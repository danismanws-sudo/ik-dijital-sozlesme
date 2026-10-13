/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#27409a",
          dark: "#1b2d73",
        },
        accent: {
          DEFAULT: "#e3262e",
          dark: "#b91c22",
        },
      },
    }
  },
  plugins: []
};
