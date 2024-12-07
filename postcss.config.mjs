/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-import": {},
    "postcss-flexbugs-fixes": {},
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: false,
              },
            ],
          },
        }
      : {}),
  },
}

export default config
