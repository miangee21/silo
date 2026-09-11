//packages/core/src/crypto/aesGcm.ts
import { randomBytes, toBase64, fromBase64 } from "./random";

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
}

export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
): Promise<EncryptedPayload> {
  const iv = randomBytes(12);
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    encoded,
  );
  return {
    ciphertext: toBase64(new Uint8Array(cipherBuffer)),
    iv: toBase64(iv),
  };
}

export async function aesGcmDecrypt(
  key: CryptoKey,
  payload: EncryptedPayload,
): Promise<string> {
  const ivBytes = fromBase64(payload.iv);
  const cipherBytes = fromBase64(payload.ciphertext);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes as BufferSource },
    key,
    cipherBytes as BufferSource,
  );
  return new TextDecoder().decode(plainBuffer);
}

export async function generateRawAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function exportAesKeyRaw(key: CryptoKey): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.exportKey("raw", key));
}

export async function importAesKeyRaw(
  rawBytes: Uint8Array,
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    rawBytes as BufferSource,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}
