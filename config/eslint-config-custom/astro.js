const { resolve } = require("node:path");
const oxlint = require("./oxlint");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  reportUnusedDisableDirectives: false,
  extends: [
    ...[
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/typescript",
      "@vercel/style-guide/eslint/browser",
      // "@vercel/style-guide/eslint/react",
      // "@vercel/style-guide/eslint/next",
      "eslint-config-turbo",
    ].map(require.resolve),
    "plugin:tailwindcss/recommended",
    "plugin:playwright/recommended",
    "plugin:jest/recommended",
    "plugin:astro/recommended",
  ],
  env: {
    "jest/globals": true,
  },
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    // allow arrow fn component
    "react/function-component-definition": "off",
    // todo: file name same as component name
    "unicorn/filename-case": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "import/no-cycle": ["error", { ignoreExternal: true }],
    "@typescript-eslint/method-signature-style": "off",
    "import/no-unresolved": "off",
    camelcase: "off",
    ...oxlint.rules,
  },
};
