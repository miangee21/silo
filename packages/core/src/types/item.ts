//packages/core/src/types/item.ts
import type { ItemField } from "./field";

export interface ItemTotp {
  secretCiphertext: string;
  secretIv: string;
}

export interface Item {
  id: string;
  vaultId: string;
  categoryId?: string | undefined;
  title: string;
  sortKey: string;
  wrappedItemKey: string;
  wrappedItemKeyIv: string;
  fields: ItemField[];
  totp?: ItemTotp | undefined;
}

/** Decrypted, in-memory-only representation. Never persisted as-is. */
export interface DecryptedItem extends Omit<Item, "fields" | "totp"> {
  fields: ItemField[];
  totpSecret?: string | undefined;
}
