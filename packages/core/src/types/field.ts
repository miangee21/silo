//packages/core/src/types/field.ts
export type FieldType =
  | "text"
  | "email"
  | "url"
  | "password"
  | "textarea"
  | "label";

export interface ItemField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  order: number;
}

export const SENSITIVE_FIELD_TYPES: readonly FieldType[] = [
  "password",
  "textarea",
];

export function isSensitiveFieldType(type: FieldType): boolean {
  return SENSITIVE_FIELD_TYPES.includes(type);
}
