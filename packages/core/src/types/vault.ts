//packages/core/src/types/vault.ts
export type VaultMode = "cloud" | "local";

export interface VaultSummary {
  id: string;
  name: string;
  icon: string;
  mode: VaultMode;
  salt: string;
  /** Only present for local vaults — absolute path on disk. Absent for cloud vaults. */
  filePath?: string | undefined;
}

export interface VaultUnlockResult {
  vaultId: string;
  masterKey: CryptoKey;
}
