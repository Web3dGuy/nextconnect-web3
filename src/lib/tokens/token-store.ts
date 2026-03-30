import type { TokenInfo } from "./default-tokens";

const STORAGE_KEY_PREFIX = "nc-tokens:";

function key(chainId: number) {
  return `${STORAGE_KEY_PREFIX}${chainId}`;
}

export function getCustomTokens(chainId: number): TokenInfo[] {
  try {
    const raw = localStorage.getItem(key(chainId));
    if (!raw) return [];
    return JSON.parse(raw) as TokenInfo[];
  } catch {
    return [];
  }
}

export function addCustomToken(chainId: number, token: TokenInfo): void {
  const existing = getCustomTokens(chainId);
  const lower = token.address.toLowerCase();
  if (existing.some((t) => t.address.toLowerCase() === lower)) return;
  try {
    localStorage.setItem(key(chainId), JSON.stringify([...existing, token]));
  } catch { /* storage unavailable */ }
}

export function removeCustomToken(chainId: number, address: string): void {
  const existing = getCustomTokens(chainId);
  const lower = address.toLowerCase();
  const filtered = existing.filter((t) => t.address.toLowerCase() !== lower);
  try {
    localStorage.setItem(key(chainId), JSON.stringify(filtered));
  } catch { /* storage unavailable */ }
}
