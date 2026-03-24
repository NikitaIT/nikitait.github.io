import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
import astroEnv from "astro-env";
import webmanifest from "astro-webmanifest";
import { z } from "astro/zod";
import { remarkPlugins } from "./plugins/index.mjs";
// import { astroCSPHashGenerator } from "./src/integrations/astroCSPHashGenerator";

// https://astro.build/config
export default defineConfig({
  site: "https://nikitait.github.io",
  markdown: {
    remarkPlugins,
  },
  output: "static",
  integrations: [
    astroEnv({
      schema: z.object({
        ABC: z.string(),
      }),
    }),
    mdx(),
    sitemap(),
    sentry(),
    webmanifest({
      /**
       * required
       **/
      name: "Nikita - blog",

      /**
       * optional
       **/
      icon: "src/images/your-icon.svg", // source for favicon & icons

      short_name: "App",
      description: "Here is your app description",
      start_url: "/",
      theme_color: "#3367D6",
      background_color: "#3367D6",
      display: "standalone",
    }),
    robotsTxt(), // dist/robots.txt
    spotlightjs(),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    partytown(),
    (await import("astro-compress")).default(),
  ],
});
