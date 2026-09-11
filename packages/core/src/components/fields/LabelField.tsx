//packages/core/src/components/fields/LabelField.tsx
import { Separator } from "../ui/separator";
import type { ItemField } from "../../types/field";

export interface LabelFieldProps {
  field: ItemField;
}

export function LabelField({ field }: LabelFieldProps) {
  return (
    <div className="flex flex-col gap-3 py-4 w-full">
      <Separator className="w-full" />
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        {field.label}
      </span>
    </div>
  );
}
