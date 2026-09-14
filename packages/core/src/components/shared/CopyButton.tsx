//packages/core/src/components/shared/CopyButton.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Copy, Check } from "lucide-react";
import { copyWithAutoClear } from "../../clipboard/clipboard";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await copyWithAutoClear(value, (text) => navigator.clipboard.writeText(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => void handleCopy()}
      title="Copy"
    >
      {copied ? <Check className="text-success h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
