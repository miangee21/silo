//packages/core/src/password-generator/generate.ts
import { randomBytes } from "../crypto/random";

export interface PasswordGeneratorOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}

export function generateSecurePassword(
  options: PasswordGeneratorOptions,
): string {
  const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const LOWER = "abcdefghijkmnpqrstuvwxyz";
  const NUMBERS = "23456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{}";

  let pool = "";
  if (options.useUpper) pool += UPPER;
  if (options.useLower) pool += LOWER;
  if (options.useNumbers) pool += NUMBERS;
  if (options.useSymbols) pool += SYMBOLS;

  if (pool.length === 0)
    throw new Error("At least one character set must be enabled.");

  const bytes = randomBytes(options.length);
  let result = "";
  for (let i = 0; i < options.length; i += 1) {
    const byte = bytes[i];
    if (byte === undefined) continue;
    result += pool[byte % pool.length];
  }
  return result;
}
