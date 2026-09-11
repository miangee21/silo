//packages/core/src/types/trash.ts
export type TrashEntityType = "item" | "vault";

export interface TrashEntry {
  id: string;
  entityType: TrashEntityType;
  name: string;
  snapshot: string;
  deletedAt: number;
}
