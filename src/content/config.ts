import { defineCollection, z } from "astro:content";

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
    complexity: z.enum(["beginner", "intermediate", "expert"]),
  }),
});

export const collections = {
  machines: machineCollection,
};
