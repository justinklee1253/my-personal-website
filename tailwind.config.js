/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        blob: "blob 7s infinite",
      },
      fontFamily: {
        custom: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        dark: {
          bg: "#0A0A0F",
          surface: "#1A1A23",
          accent: "#2A2A35",
        },
      },
      backgroundImage: {
        "dark-gradient":
          "radial-gradient(circle at center, #1A1A23 0%, #0A0A0F 100%)",
      },
    },
  },
  plugins: [],
};
