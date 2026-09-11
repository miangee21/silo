//packages/core/src/components/fields/TextField.tsx
import { Input } from "../ui/input";
import type { ItemField } from "../../types/field";

export interface SimpleFieldProps {
  field: ItemField;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function TextField({ field, onChange, readOnly }: SimpleFieldProps) {
  return (
    <Input
      type="text"
      value={field.value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={field.label}
      className="w-full"
    />
  );
}
