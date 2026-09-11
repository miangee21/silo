//packages/core/src/components/fields/PasswordField.tsx
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "../shared/CopyButton";
import { PasswordGeneratorPopover } from "../password-generator/PasswordGeneratorPopover";
import type { SimpleFieldProps } from "./TextField";

export function PasswordField({ field, onChange, readOnly }: SimpleFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex gap-2 w-full relative">
      <Input
        type={show ? "text" : "password"}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={field.label}
        className="w-full pr-24"
      />
      <div className="absolute right-1 top-1 flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <CopyButton value={field.value} />
        <PasswordGeneratorPopover onApply={(val) => onChange(val)} />
      </div>
    </div>
  );
}
