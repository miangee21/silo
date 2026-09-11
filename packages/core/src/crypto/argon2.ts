//packages/core/src/crypto/argon2.ts
import { argon2id } from "hash-wasm";
import { randomBytes, toBase64, fromBase64 } from "./random";

const ARGON2_ITERATIONS = 3;
const ARGON2_MEMORY_KIB = 65536; // 64 MB
const ARGON2_PARALLELISM = 1;
const ARGON2_HASH_LENGTH = 32; // 256-bit key

export function generateVaultSalt(): string {
  return toBase64(randomBytes(16));
}

/**
 * Derives a 256-bit key from a master password + salt via Argon2id, then
 * imports it as a NON-EXTRACTABLE AES-GCM CryptoKey — the raw bytes never
 * exist in a readable form beyond this function's local scope.
 */
export async function deriveVaultMasterKey(
  masterPassword: string,
  saltBase64: string,
): Promise<CryptoKey> {
  const saltBytes = fromBase64(saltBase64);

  const derivedHex = await argon2id({
    password: masterPassword,
    salt: saltBytes,
    iterations: ARGON2_ITERATIONS,
    memorySize: ARGON2_MEMORY_KIB,
    parallelism: ARGON2_PARALLELISM,
    hashLength: ARGON2_HASH_LENGTH,
    outputType: "hex",
  });

  const rawKeyBytes = new Uint8Array(
    derivedHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  return crypto.subtle.importKey(
    "raw",
    rawKeyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
