//packages/core/src/components/totp/TotpCodeRing.tsx
import { useState, useEffect } from "react";
import { getCurrentTotpCode } from "../../totp/totp";
import { CopyButton } from "../shared/CopyButton";

interface TotpCodeRingProps {
  totpSecret: string;
}

export function TotpCodeRing({ totpSecret }: TotpCodeRingProps) {
  const [codeInfo, setCodeInfo] = useState({
    code: "------",
    secondsRemaining: 30,
  });

  useEffect(() => {
    if (!totpSecret) return;

    const update = () => setCodeInfo(getCurrentTotpCode(totpSecret));
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [totpSecret]);

  if (!totpSecret) return null;

  const progress = (codeInfo.secondsRemaining / 30) * 100;
  const isExpiring = codeInfo.secondsRemaining <= 5;
  const strokeColor = isExpiring ? "var(--destructive)" : "var(--success)";

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-muted"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="transition-all duration-1000 ease-linear"
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray="100 100"
            strokeDashoffset={100 - progress}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-xs font-mono font-bold">
          {codeInfo.secondsRemaining}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-2xl font-mono tracking-widest">
          {codeInfo.code}
        </span>
        <CopyButton value={codeInfo.code} />
      </div>
    </div>
  );
}
