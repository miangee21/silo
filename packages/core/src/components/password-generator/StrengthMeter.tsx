//packages/core/src/components/password-generator/StrengthMeter.tsx
import { useMemo } from "react";
import { estimatePasswordStrength } from "../../password-generator/strength";

interface StrengthMeterProps {
  options: {
    length: number;
    useUpper: boolean;
    useLower: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
  };
}

export function StrengthMeter({ options }: StrengthMeterProps) {
  const strength = useMemo(() => estimatePasswordStrength(options), [options]);

  const getStrengthColor = () => {
    if (strength === "weak") return "bg-destructive";
    if (strength === "medium") return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="flex flex-col gap-1 mt-2 w-full">
      <div className="flex gap-1 h-1.5 w-full">
        <div
          className={`h-full flex-1 rounded-l-full transition-colors ${getStrengthColor()}`}
        />
        <div
          className={`h-full flex-1 transition-colors ${strength === "weak" ? "bg-muted" : getStrengthColor()}`}
        />
        <div
          className={`h-full flex-1 rounded-r-full transition-colors ${strength === "strong" ? getStrengthColor() : "bg-muted"}`}
        />
      </div>
      <span className="text-xs text-right text-muted-foreground capitalize">
        {strength}
      </span>
    </div>
  );
}
