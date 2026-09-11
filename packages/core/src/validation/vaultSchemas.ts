//packages/core/src/validation/vaultSchemas.ts
import { z } from "zod";

export const masterPasswordRule = z
  .string()
  .min(15, "Master password must be at least 15 characters.")
  .max(30, "Master password must be at most 30 characters.")
  .regex(/[A-Z]/, "Must include at least one uppercase letter.")
  .regex(/[0-9]/, "Must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Must include at least one symbol.");

export const createVaultSchema = z.object({
  name: z
    .string()
    .min(1, "Vault name is required.")
    .max(60, "Vault name is too long."),
  icon: z.string().min(1, "Choose an icon."),
  masterPassword: masterPasswordRule,
});
export type CreateVaultInput = z.infer<typeof createVaultSchema>;

export const unlockVaultSchema = z.object({
  masterPassword: z.string().min(1, "Master password is required."),
});
export type UnlockVaultInput = z.infer<typeof unlockVaultSchema>;

export const changeMasterPasswordSchema = z.object({
  currentMasterPassword: z
    .string()
    .min(1, "Current master password is required."),
  newMasterPassword: masterPasswordRule,
});
export type ChangeMasterPasswordInput = z.infer<
  typeof changeMasterPasswordSchema
>;
