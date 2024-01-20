import { z } from "astro:content";

export const MachineComplexity = z.enum(["beginner", "intermediate", "expert"]);
export type MachineComplexity = z.infer<typeof MachineComplexity>;
