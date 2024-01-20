import { z } from "astro:content";

export const MachineComplexity = z.enum(["beginner", "intermediate", "advanced"]);
export type MachineComplexity = z.infer<typeof MachineComplexity>;
