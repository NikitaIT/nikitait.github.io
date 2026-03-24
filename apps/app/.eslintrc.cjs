/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["custom/astro"],
  parserOptions: {
    extraFileExtensions: [".astro"],
  },
};

module.exports = config;
