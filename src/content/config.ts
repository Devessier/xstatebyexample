import { defineCollection, z } from "astro:content";
import { MachineComplexity } from "../lib/types";

const machineCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      id: z.number().nonnegative(),
      title: z.string(),
      image: z.object({
        url: image(),
      }),
      visualizerSrc: z.string(),
      complexity: MachineComplexity,
      youtubeVideoId: z.string().optional(),
    }),
});

const tipCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number().nonnegative(),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  machines: machineCollection,
  tips: tipCollection,
};
