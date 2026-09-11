//packages/core/src/hooks/useUnsavedGuard.ts
import { useEffect } from "react";

type DirtyChecker = () => boolean;

const registry = new Set<DirtyChecker>();

export function isAnyFormDirty(): boolean {
  for (const check of registry) {
    if (check()) return true;
  }
  return false;
}

export function useUnsavedGuard(isDirty: DirtyChecker): void {
  useEffect(() => {
    registry.add(isDirty);
    return () => {
      registry.delete(isDirty);
    };
  }, [isDirty]);
}
