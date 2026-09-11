//packages/core/src/crypto/envelope.ts
import type { ItemField } from "../types/field";
import { isSensitiveFieldType } from "../types/field";
import {
  aesGcmDecrypt,
  aesGcmEncrypt,
  exportAesKeyRaw,
  generateRawAesKey,
  importAesKeyRaw,
} from "./aesGcm";

export interface WrappedItemKeyPayload {
  wrappedItemKey: string;
  wrappedItemKeyIv: string;
}

export async function createWrappedItemKey(
  vaultMasterKey: CryptoKey,
): Promise<{ itemKey: CryptoKey; wrapped: WrappedItemKeyPayload }> {
  const itemKey = await generateRawAesKey();
  const rawItemKeyBytes = await exportAesKeyRaw(itemKey);
  const rawItemKeyString = btoa(String.fromCharCode(...rawItemKeyBytes));
  const encrypted = await aesGcmEncrypt(vaultMasterKey, rawItemKeyString);

  return {
    itemKey,
    wrapped: {
      wrappedItemKey: encrypted.ciphertext,
      wrappedItemKeyIv: encrypted.iv,
    },
  };
}

export async function unwrapItemKey(
  vaultMasterKey: CryptoKey,
  wrapped: WrappedItemKeyPayload,
): Promise<CryptoKey> {
  const rawItemKeyString = await aesGcmDecrypt(vaultMasterKey, {
    ciphertext: wrapped.wrappedItemKey,
    iv: wrapped.wrappedItemKeyIv,
  });
  const rawItemKeyBytes = Uint8Array.from(atob(rawItemKeyString), (c) =>
    c.charCodeAt(0),
  );
  return importAesKeyRaw(rawItemKeyBytes);
}

export async function encryptSensitiveFields(
  itemKey: CryptoKey,
  fields: ItemField[],
): Promise<ItemField[]> {
  const results: ItemField[] = [];
  for (const field of fields) {
    if (isSensitiveFieldType(field.type)) {
      const encrypted = await aesGcmEncrypt(itemKey, field.value);
      results.push({
        ...field,
        value: JSON.stringify({ c: encrypted.ciphertext, iv: encrypted.iv }),
      });
    } else {
      results.push(field);
    }
  }
  return results;
}

export async function decryptSensitiveFields(
  itemKey: CryptoKey,
  fields: ItemField[],
): Promise<ItemField[]> {
  const results: ItemField[] = [];
  for (const field of fields) {
    if (isSensitiveFieldType(field.type)) {
      const parsed = JSON.parse(field.value) as { c: string; iv: string };
      const plaintext = await aesGcmDecrypt(itemKey, {
        ciphertext: parsed.c,
        iv: parsed.iv,
      });
      results.push({ ...field, value: plaintext });
    } else {
      results.push(field);
    }
  }
  return results;
}
