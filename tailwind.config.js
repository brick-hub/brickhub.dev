const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#0f0f0f",
        gray: "#262525",
        night: "#010101",
        charcoal: "var(--tw-prose-invert-hr)",
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: "" },
            "code::after": { content: "" },
          },
        },
      },
    },
    fontFamily: {
      sans: ["inter", ...defaultTheme.fontFamily.sans],
      mono: ["SourceCodePro", ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
