import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import expressiveCode from "astro-expressive-code";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://xstatebyexample.com",
  image: {
    domains: ["stately.ai"],
  },
  integrations: [
    expressiveCode({
      // themes: ["min-light"],
      styleOverrides: {
        frames: {
          editorActiveTabIndicatorTopColor: "#f87171",
        },
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
});
