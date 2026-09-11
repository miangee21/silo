//packages/core/src/storage/LocalFileStorageAdapter.ts
import type { StorageAdapter } from "./StorageAdapter";
import type { Category } from "../types/category";
import type { Item } from "../types/item";
import type { TrashEntry } from "../types/trash";

/**
 * The on-disk shape of a `.silo` local vault file.
 *   HEADER — always plaintext, read without decrypting, used to render the
 *            vault "card" (name, icon) before the user enters a password.
 *   BODY   — same encryption rules as cloud vaults: only `password` and
 *            `textarea` field values (and TOTP secrets) are ciphertext.
 */
export interface SiloLocalFileHeader {
  format: "silo_local_v1";
  name: string;
  icon: string;
  salt: string;
  canaryCiphertext: string;
  canaryIv: string;
}

export interface SiloLocalFileBody {
  categories: Category[];
  items: Item[];
  trash: TrashEntry[];
}

export interface SiloLocalFile {
  header: SiloLocalFileHeader;
  body: SiloLocalFileBody;
}

/**
 * Reads/writes a single `.silo` file. The host app (Silo or Silo-Lite)
 * supplies its own `readFile`/`writeFile` functions (both backed by the
 * Tauri fs plugin in practice) so this class has zero direct dependency on
 * any specific Tauri API version — it only needs bytes in, bytes out.
 */
export class LocalFileStorageAdapter implements StorageAdapter {
  public readonly mode = "local" as const;

  private body: SiloLocalFileBody;

  public constructor(
    private readonly filePath: string,
    initialBody: SiloLocalFileBody,
    private readonly writeFile: (
      path: string,
      contents: string,
    ) => Promise<void>,
    private readonly header: SiloLocalFileHeader,
  ) {
    this.body = initialBody;
  }

  public static async readHeader(
    filePath: string,
    readFile: (path: string) => Promise<string>,
  ): Promise<SiloLocalFileHeader> {
    const raw = await readFile(filePath);
    const parsed = JSON.parse(raw) as SiloLocalFile;
    return parsed.header;
  }

  public static async open(
    filePath: string,
    readFile: (path: string) => Promise<string>,
  ): Promise<{ header: SiloLocalFileHeader; body: SiloLocalFileBody }> {
    const raw = await readFile(filePath);
    const parsed = JSON.parse(raw) as SiloLocalFile;
    return { header: parsed.header, body: parsed.body };
  }

  private async persist(): Promise<void> {
    const fileContents: SiloLocalFile = {
      header: this.header,
      body: this.body,
    };
    await this.writeFile(this.filePath, JSON.stringify(fileContents, null, 2));
  }

  public async listCategories(): Promise<Category[]> {
    await Promise.resolve();
    return this.body.categories;
  }

  public async createCategory(input: {
    name: string;
    icon: string;
    sortKey: string;
  }): Promise<Category> {
    const category: Category = {
      id: crypto.randomUUID(),
      vaultId: this.filePath,
      ...input,
    };
    this.body.categories.push(category);
    await this.persist();
    return category;
  }

  public async updateCategory(
    id: string,
    input: { name: string; icon: string; sortKey: string },
  ): Promise<void> {
    const index = this.body.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found.");
    const existing = this.body.categories[index];
    if (!existing) throw new Error("Category not found.");
    this.body.categories[index] = { ...existing, ...input };
    await this.persist();
  }

  public async deleteCategory(id: string): Promise<void> {
    this.body.categories = this.body.categories.filter((c) => c.id !== id);
    this.body.items = this.body.items.map((item) =>
      item.categoryId === id ? { ...item, categoryId: undefined } : item,
    );
    await this.persist();
  }

  public async listItems(): Promise<Item[]> {
    await Promise.resolve();
    return this.body.items;
  }

  public async createItem(item: Omit<Item, "id">): Promise<Item> {
    const fullItem: Item = { id: crypto.randomUUID(), ...item };
    this.body.items.push(fullItem);
    await this.persist();
    return fullItem;
  }

  public async updateItem(
    id: string,
    patch: Partial<Omit<Item, "id">>,
  ): Promise<void> {
    const index = this.body.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found.");
    const existing = this.body.items[index];
    if (!existing) throw new Error("Item not found.");
    this.body.items[index] = { ...existing, ...patch };
    await this.persist();
  }

  public async deleteItem(id: string): Promise<void> {
    const item = this.body.items.find((i) => i.id === id);
    if (!item) throw new Error("Item not found.");

    const trashEntry: TrashEntry = {
      id: crypto.randomUUID(),
      entityType: "item",
      name: item.title,
      snapshot: JSON.stringify(item),
      deletedAt: Date.now(),
    };

    this.body.trash.push(trashEntry);
    this.body.items = this.body.items.filter((i) => i.id !== id);
    await this.persist();
  }

  public async listTrash(): Promise<TrashEntry[]> {
    await Promise.resolve();
    return this.body.trash;
  }

  public async restoreFromTrash(trashId: string): Promise<void> {
    const entry = this.body.trash.find((t) => t.id === trashId);
    if (!entry) throw new Error("Trash entry not found.");
    const item = JSON.parse(entry.snapshot) as Item;
    this.body.items.push(item);
    this.body.trash = this.body.trash.filter((t) => t.id !== trashId);
    await this.persist();
  }

  public async deleteForever(trashId: string): Promise<void> {
    this.body.trash = this.body.trash.filter((t) => t.id !== trashId);
    await this.persist();
  }

  public async flush(): Promise<void> {
    await this.persist();
  }
}
