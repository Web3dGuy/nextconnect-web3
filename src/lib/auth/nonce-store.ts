/**
 * Server-side nonce store for SIWE authentication.
 *
 * WARNING: This is an in-memory store. It works for single-instance
 * deployments (e.g. `next start` on one server). For serverless or
 * multi-instance deployments (Vercel, AWS Lambda), replace this with
 * Redis, Upstash, or a database-backed store.
 */

const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_NONCES = 10_000;

type NonceEntry = {
  createdAt: number;
};

const nonceStore = new Map<string, NonceEntry>();

export function storeNonce(nonce: string): void {
  cleanup();
  if (nonceStore.size >= MAX_NONCES) {
    const oldest = nonceStore.keys().next().value;
    if (oldest) nonceStore.delete(oldest);
  }
  nonceStore.set(nonce, { createdAt: Date.now() });
}

export function consumeNonce(nonce: string): boolean {
  cleanup();
  const entry = nonceStore.get(nonce);
  if (!entry) return false;

  nonceStore.delete(nonce);

  if (Date.now() - entry.createdAt > NONCE_TTL_MS) {
    return false;
  }

  return true;
}

function cleanup() {
  const now = Date.now();
  for (const [nonce, entry] of nonceStore) {
    if (now - entry.createdAt > NONCE_TTL_MS * 2) {
      nonceStore.delete(nonce);
    }
  }
}
