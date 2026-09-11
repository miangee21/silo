//packages/core/src/storage/StorageAdapter.ts
import type { Category } from "../types/category";
import type { Item } from "../types/item";
import type { TrashEntry } from "../types/trash";

export interface StorageAdapter {
  readonly mode: "cloud" | "local";

  listCategories(): Promise<Category[]>;
  createCategory(input: {
    name: string;
    icon: string;
    sortKey: string;
  }): Promise<Category>;
  updateCategory(
    id: string,
    input: { name: string; icon: string; sortKey: string },
  ): Promise<void>;
  deleteCategory(id: string): Promise<void>;

  listItems(): Promise<Item[]>;
  createItem(item: Omit<Item, "id">): Promise<Item>;
  updateItem(id: string, item: Partial<Omit<Item, "id">>): Promise<void>;
  deleteItem(id: string): Promise<void>;

  listTrash(): Promise<TrashEntry[]>;
  restoreFromTrash(trashId: string): Promise<void>;
  deleteForever(trashId: string): Promise<void>;

  /** Persists any pending in-memory changes to durable storage (no-op for Convex, writes the file for local). */
  flush(): Promise<void>;
}
