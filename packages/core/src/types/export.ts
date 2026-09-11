//packages/core/src/types/export.ts
import type { ItemField } from "./field";

export interface ExportedItem {
  title: string;
  categoryName: string | null;
  fields: ItemField[];
  totpSecret: string | null;
}

export interface ExportedCategory {
  name: string;
  icon: string;
}

export interface SiloExportFile {
  format: "silo_export_v1";
  vaultName: string;
  exportedAt: number;
  categories: ExportedCategory[];
  items: ExportedItem[];
}
