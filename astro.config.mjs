// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  renderers: [],
  devOptions: {
    tailwindConfig: "./tailwind.config.js",
  },
  buildOptions: {
    site: "https://brickhub.dev",
  },
});
