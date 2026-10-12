// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1f36",   // Koyu Lacivert (Antrasit)
        accent: "#c1121f",    // Kırmızı
        grayBg: "#f5f5f5"     // Açık Gri / Beyaz
      }
    }
  },
  plugins: []
};
