//packages/core/src/validation/itemSchemas.ts
import { z } from "zod";

export const fieldTypeSchema = z.union([
  z.literal("text"),
  z.literal("email"),
  z.literal("url"),
  z.literal("password"),
  z.literal("textarea"),
  z.literal("label"),
]);

export const itemFieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string().min(1, "Field label is required."),
  value: z.string(),
  order: z.number(),
});

export const itemSchema = z.object({
  title: z.string().min(1, "Title is required.").max(120, "Title is too long."),
  categoryId: z.string().nullable(),
  fields: z.array(itemFieldSchema),
});
export type ItemInput = z.infer<typeof itemSchema>;
