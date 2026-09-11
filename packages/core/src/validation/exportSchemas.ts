//packages/core/src/validation/exportSchemas.ts
import { z } from "zod";
import { itemFieldSchema } from "./itemSchemas";

export const exportedItemSchema = z.object({
  title: z.string(),
  categoryName: z.string().nullable(),
  fields: z.array(itemFieldSchema),
  totpSecret: z.string().nullable(),
});

export const exportedCategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
});

export const siloExportFileSchema = z.object({
  format: z.literal("silo_export_v1"),
  vaultName: z.string(),
  exportedAt: z.number(),
  categories: z.array(exportedCategorySchema),
  items: z.array(exportedItemSchema),
});
