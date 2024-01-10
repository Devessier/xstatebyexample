import { defineConfig } from "@pandacss/dev";
import typographyPreset from "pandacss-preset-typography";
import pandaPreset from '@pandacss/preset-panda'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{ts,tsx,js,jsx,astro}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",

  presets: [
    typographyPreset(),
    pandaPreset,
  ]
});
