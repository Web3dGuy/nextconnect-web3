export type StoredTransaction = {
  hash: `0x${string}`;
  to: string;
  value: string;
  tokenSymbol?: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  chainId: number;
};

const STORAGE_KEY_PREFIX = "nc-txs:";
const MAX_TRANSACTIONS = 100;

function key(chainId: number, address: string) {
  return `${STORAGE_KEY_PREFIX}${chainId}:${address.toLowerCase()}`;
}

export function getTransactions(chainId: number, address: string): StoredTransaction[] {
  try {
    const raw = localStorage.getItem(key(chainId, address));
    if (!raw) return [];
    return JSON.parse(raw) as StoredTransaction[];
  } catch {
    return [];
  }
}

export function addTransaction(chainId: number, address: string, tx: StoredTransaction): void {
  const existing = getTransactions(chainId, address);
  const updated = [tx, ...existing].slice(0, MAX_TRANSACTIONS);
  try {
    localStorage.setItem(key(chainId, address), JSON.stringify(updated));
  } catch { /* storage unavailable */ }
}

export function updateTransactionStatus(
  chainId: number,
  address: string,
  hash: string,
  status: "confirmed" | "failed"
): void {
  const existing = getTransactions(chainId, address);
  const updated = existing.map((tx) =>
    tx.hash === hash ? { ...tx, status } : tx
  );
  try {
    localStorage.setItem(key(chainId, address), JSON.stringify(updated));
  } catch { /* storage unavailable */ }
}
