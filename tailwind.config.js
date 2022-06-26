const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#0f0f0f",
        gray: "#262525",
        night: "#010101",
      },
    },
    fontFamily: {
      sans: ["inter", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
