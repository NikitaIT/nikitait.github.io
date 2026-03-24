// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "tailwind-config/tailwind.config.ts";

const config: Pick<Config, "presets" | "content" | "plugins"> = {
  presets: [sharedConfig], // require("@acme/design-system/tailwind"),
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,astro}",
    // Add the external packages that are using Tailwind CSS
    // "./node_modules/@vercel/examples-ui/**/*.js",
    // "./node_modules/@acme/design-system/**/*.tsx",
    // "./node_modules/@acme/pages/**/*.tsx",
  ],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ok
  plugins: [require("tailwindcss/nesting")],
};

export default config;
