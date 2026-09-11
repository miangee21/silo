//packages/core/src/components/password-generator/PasswordGeneratorPopover.tsx
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { KeyRound, RefreshCw } from "lucide-react";
import { generateSecurePassword } from "../../password-generator/generate";
import { StrengthMeter } from "./StrengthMeter";
import { CopyButton } from "../shared/CopyButton";

interface PasswordGeneratorPopoverProps {
  onApply: (password: string) => void;
}

export function PasswordGeneratorPopover({ onApply }: PasswordGeneratorPopoverProps) {
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const [generated, setGenerated] = useState(() => {
    try {
      return generateSecurePassword({
        length: 20,
        useUpper: true,
        useLower: true,
        useNumbers: true,
        useSymbols: true,
      });
    } catch (error) {
      console.warn("Initial password generation failed:", error);
      return "";
    }
  });

  const handleRegenerate = (overrideOptions?: {
    length?: number;
    useUpper?: boolean;
    useLower?: boolean;
    useNumbers?: boolean;
    useSymbols?: boolean;
  }) => {
    try {
      const pass = generateSecurePassword({
        length,
        useUpper,
        useLower,
        useNumbers,
        useSymbols,
        ...overrideOptions,
      });
      setGenerated(pass);
    } catch (error) {
      console.warn(
        "Password regeneration aborted:",
        error instanceof Error ? error.message : "Invalid options",
      );
    }
  };

  const handleToggle = (
    setter: (val: boolean) => void,
    currentVal: boolean,
    key: string,
  ) => {
    const activeCount = [useUpper, useLower, useNumbers, useSymbols].filter(
      Boolean,
    ).length;
    if (activeCount === 1 && currentVal) return;
    setter(!currentVal);
    handleRegenerate({ [key]: !currentVal });
  };

  const handleSliderChange = (vals: readonly number[] | number) => {
    const newLength = typeof vals === "number" ? vals : vals[0]!;
    setLength(newLength);
    handleRegenerate({ length: newLength });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-primary h-7 w-7"
          />
        }
      >
        <KeyRound className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-muted flex-1 truncate rounded-md p-2 font-mono text-lg">
                {generated || "---"}
              </div>
              <Button variant="outline" size="icon" onClick={() => handleRegenerate()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <CopyButton value={generated} />
            </div>
            <StrengthMeter
              options={{ length, useUpper, useLower, useNumbers, useSymbols }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Length: {length}</Label>
              <Slider
                value={[length]}
                onValueChange={handleSliderChange}
                min={8}
                max={64}
                step={1}
                className="w-[60%]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="upper">Uppercase (A-Z)</Label>
              <Switch
                id="upper"
                checked={useUpper}
                onCheckedChange={() => handleToggle(setUseUpper, useUpper, "useUpper")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lower">Lowercase (a-z)</Label>
              <Switch
                id="lower"
                checked={useLower}
                onCheckedChange={() => handleToggle(setUseLower, useLower, "useLower")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Numbers (0-9)</Label>
              <Switch
                id="numbers"
                checked={useNumbers}
                onCheckedChange={() =>
                  handleToggle(setUseNumbers, useNumbers, "useNumbers")
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Symbols (!@#$)</Label>
              <Switch
                id="symbols"
                checked={useSymbols}
                onCheckedChange={() =>
                  handleToggle(setUseSymbols, useSymbols, "useSymbols")
                }
              />
            </div>
          </div>

          <Button className="w-full" onClick={() => onApply(generated)}>
            Use Password
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
