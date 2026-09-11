//packages/core/src/validation/categorySchemas.ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required.").max(60, "Too long."),
  icon: z.string().min(1, "Choose an icon."),
});
export type CategoryInput = z.infer<typeof categorySchema>;
