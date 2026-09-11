//packages/core/src/totp/totp.ts
import { TOTP, Secret } from "otpauth";

export function createTotpGenerator(base32Secret: string): TOTP {
  return new TOTP({
    issuer: "Silo",
    label: "Silo",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(base32Secret),
  });
}

export function getCurrentTotpCode(base32Secret: string): {
  code: string;
  secondsRemaining: number;
} {
  const totp = createTotpGenerator(base32Secret);
  const code = totp.generate();
  const secondsRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);
  return { code, secondsRemaining };
}
