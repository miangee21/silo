//packages/core/src/components/fields/EmailField.tsx
import { Input } from "../ui/input";
import type { SimpleFieldProps } from "./TextField";

export function EmailField({ field, onChange, readOnly }: SimpleFieldProps) {
  return (
    <Input
      type="email"
      value={field.value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={field.label}
      className="w-full"
    />
  );
}
