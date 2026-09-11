//packages/core/src/sort/naturalSort.ts
function charRank(ch: string): number {
  if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - "0".charCodeAt(0);
  if (ch >= "A" && ch <= "Z")
    return 10 + (ch.charCodeAt(0) - "A".charCodeAt(0)) * 2;
  if (ch >= "a" && ch <= "z")
    return 10 + (ch.charCodeAt(0) - "a".charCodeAt(0)) * 2 + 1;
  return 1000 + ch.charCodeAt(0);
}

export function naturalSortKey(input: string): string {
  const chunks: string[] = [];
  let numberBuffer = "";

  for (const ch of input) {
    if (ch >= "0" && ch <= "9") {
      numberBuffer += ch;
      continue;
    }
    if (numberBuffer) {
      chunks.push(numberBuffer.padStart(6, "0"));
      numberBuffer = "";
    }
    chunks.push(String(charRank(ch)).padStart(4, "0"));
  }
  if (numberBuffer) chunks.push(numberBuffer.padStart(6, "0"));

  return chunks.join("-");
}

export function naturalSort<T>(list: T[], getName: (item: T) => string): T[] {
  return [...list].sort((a, b) =>
    naturalSortKey(getName(a)).localeCompare(naturalSortKey(getName(b))),
  );
}
