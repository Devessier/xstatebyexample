import { defineConfig } from "@pandacss/dev";
import typographyPreset from "pandacss-preset-typography";
import pandaPreset from "@pandacss/preset-panda";
import formPreset from "pform-reset";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{ts,tsx,js,jsx,astro,mdx}"],

  // Files to exclude
  exclude: [],

  globalCss: {
    button: {
      cursor: "pointer",
    },
  },

  conditions: {
    extend: {
      deviceNoHover: "@media (hover: none)",
      groupOpen: ".group[open] &",
    },
  },

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        /**
         * Comes from https://github.com/fkhadra/react-toastify/blob/edb231d07cc298a82e26d489030356387906ff92/scss/_progressBar.scss#L1-L8.
         */
        "progress-bar": {
          "0%": {
            transform: "scaleX(1)",
          },
          "100%": {
            transform: "scaleX(0)",
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  presets: [
    typographyPreset({
      recipe: {
        notProse: true,
      },
    }),
    pandaPreset,
    formPreset,
  ],
});
