/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0a0a0a",
        surface: "#111111",
        edge: "#222222",
        ink: { DEFAULT: "#fafafa", body: "#8a8a8a", dim: "#5c5c5c" },
        accent: "#9fe8b8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        col: "44rem",
      },
    },
  },
  plugins: [],
};
