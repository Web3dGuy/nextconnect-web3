export type NFTCollection = {
  address: `0x${string}`;
  name: string;
  symbol: string;
};

const STORAGE_KEY_PREFIX = "nc-nfts:";

function key(chainId: number) {
  return `${STORAGE_KEY_PREFIX}${chainId}`;
}

export function getTrackedNFTs(chainId: number): NFTCollection[] {
  try {
    const raw = localStorage.getItem(key(chainId));
    if (!raw) return [];
    return JSON.parse(raw) as NFTCollection[];
  } catch {
    return [];
  }
}

export function addTrackedNFT(chainId: number, collection: NFTCollection): void {
  const existing = getTrackedNFTs(chainId);
  const lower = collection.address.toLowerCase();
  if (existing.some((c) => c.address.toLowerCase() === lower)) return;
  try {
    localStorage.setItem(key(chainId), JSON.stringify([...existing, collection]));
  } catch { /* storage unavailable */ }
}

export function removeTrackedNFT(chainId: number, address: string): void {
  const existing = getTrackedNFTs(chainId);
  const lower = address.toLowerCase();
  const filtered = existing.filter((c) => c.address.toLowerCase() !== lower);
  try {
    localStorage.setItem(key(chainId), JSON.stringify(filtered));
  } catch { /* storage unavailable */ }
}
