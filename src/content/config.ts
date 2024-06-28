import { defineCollection, reference, z } from "astro:content";
import { MachineComplexity } from "../lib/types";

const authorCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string().min(1),
    avatarUrl: z.string().url(),
  }),
});

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
      author: reference("authors").default("baptiste-devessier"),
    }),
});

const tipCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number().nonnegative(),
    title: z.string(),
  }),
});

export const collections = {
  machines: machineCollection,
  tips: tipCollection,
  authors: authorCollection,
};
