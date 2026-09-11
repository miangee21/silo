//packages/core/src/clipboard/clipboard.ts
const CLIPBOARD_CLEAR_DELAY_MS = 60_000;

let pendingClearTimeout: ReturnType<typeof setTimeout> | null = null;

export async function copyWithAutoClear(
  value: string,
  writeText: (text: string) => Promise<void>,
): Promise<void> {
  await writeText(value);
  if (pendingClearTimeout) clearTimeout(pendingClearTimeout);
  pendingClearTimeout = setTimeout(() => {
    void writeText("");
  }, CLIPBOARD_CLEAR_DELAY_MS);
}
