/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171B1A",
        paper: "#FAFAF7",
        forest: {
          DEFAULT: "#1F6F50",
          dark: "#154D37",
          light: "#E7F2EC",
        },
        mustard: {
          DEFAULT: "#DDA22B",
          dark: "#B37F1B",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};
