//packages/core/src/password-generator/strength.ts
export type StrengthLevel = "weak" | "medium" | "strong";

export function estimatePasswordStrength(options: {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}): StrengthLevel {
  let poolSize = 0;
  if (options.useUpper) poolSize += 24;
  if (options.useLower) poolSize += 24;
  if (options.useNumbers) poolSize += 8;
  if (options.useSymbols) poolSize += 18;

  const entropyBits = options.length * Math.log2(Math.max(poolSize, 1));

  if (entropyBits < 60) return "weak";
  if (entropyBits < 100) return "medium";
  return "strong";
}
