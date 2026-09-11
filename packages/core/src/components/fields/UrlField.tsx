//packages/core/src/components/fields/UrlField.tsx
import { Input } from "../ui/input";
import type { SimpleFieldProps } from "./TextField";

export function UrlField({ field, onChange, readOnly }: SimpleFieldProps) {
  return (
    <Input
      type="url"
      value={field.value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={field.label}
      className="w-full"
    />
  );
}
