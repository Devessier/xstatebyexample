import { defineCollection, z } from "astro:content";
import { MachineComplexity } from "../lib/types";

const machineCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number().nonnegative(),
    title: z.string(),
    image: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    complexity: MachineComplexity,
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
};
