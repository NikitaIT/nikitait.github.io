// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors

// See https://cssdb.org/
const stage = {
  experimental: 0, // This is a crazy idea. Unofficial Draft
  aspirational: 1, // This idea might not be crazy. Editor’s Draft
  allowable: 2, // This idea is not crazy. Working Draft
  embraced: 3, // This idea is becoming part of the web. Candidate Recommendation
  standardized: 4, // This idea is part of the web. Recommendation
};
// https://nextjs.org/docs/messages/postcss-shape
const preserve = true;

// throw require("postcss-nesting")();

module.exports = {
  // plugins: {
  //   tailwindcss: {},
  //   autoprefixer: {},
  // },
  plugins: [
    ["postcss-import", {}], // css @import
    ["postcss-focus-visible", {}],
    "postcss-nesting",
    ["tailwindcss/nesting", require("postcss-nesting")()],
    ["tailwindcss", {}],
    [
      "postcss-preset-env",
      {
        stage: stage.experimental,
        preserve,
        "nesting-rules": false, // tailwindcss/nesting already defined
        autoprefixer: { grid: "autoplace" },
      },
    ],
    "postcss-reporter",
  ].map((x) => (typeof x === "string" ? require(x) : require(x[0])(x[1]))),
};
