/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- The new, correct way
    autoprefixer: {},
  },
};

export default config;