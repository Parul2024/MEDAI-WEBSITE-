/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        // Calming clinical palette - deep pine + warm sand, not the generic
        // terracotta/cream or dark+neon combos.
        pine: {
          50: "#f0f7f4",
          100: "#daece3",
          200: "#b6d9cb",
          300: "#87bfab",
          400: "#5aa088",
          500: "#3e8570",
          600: "#2f6c5a",
          700: "#285749",
          800: "#22463c",
          900: "#1c3a32",
          950: "#0e211c",
        },
        sand: {
          50: "#fbf9f4",
          100: "#f5f0e4",
          200: "#ebe0c8",
          300: "#dcc99f",
          400: "#cbae73",
          500: "#bd9756",
          600: "#a67f47",
        },
        clay: "#c5654a",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(28, 58, 50, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
