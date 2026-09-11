//packages/core/src/components/totp/TotpInputDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface TotpInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (secret: string) => void;
}

export function TotpInputDialog({
  open,
  onOpenChange,
  onSave,
}: TotpInputDialogProps) {
  const [secret, setSecret] = useState("");

  const handleSave = () => {
    if (!secret.trim()) return;
    onSave(secret.replace(/\s+/g, "").toUpperCase());
    setSecret("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add TOTP Authenticator</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Enter setup key (Base32 secret)"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <Button onClick={handleSave}>Save Authenticator</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
