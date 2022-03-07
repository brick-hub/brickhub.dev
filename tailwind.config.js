const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["inter", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};
