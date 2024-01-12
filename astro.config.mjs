import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["stately.ai"]
  },
  integrations: [expressiveCode(), mdx(), react()]
});