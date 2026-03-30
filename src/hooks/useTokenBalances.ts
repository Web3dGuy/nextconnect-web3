"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { getDefaultTokens, type TokenInfo } from "@/lib/tokens/default-tokens";
import { getCustomTokens } from "@/lib/tokens/token-store";
import { batchGetERC20Balances } from "@/lib/tokens/erc20";

export type TokenWithBalance = TokenInfo & {
  balance: bigint;
  formatted: string;
  isCustom: boolean;
};

export type NativeTokenBalance = {
  symbol: string;
  name: string;
  decimals: number;
  balance: bigint;
  formatted: string;
};

const POLL_INTERVAL = 30_000;

export function useTokenBalances() {
  const { address, chainId } = useAccount();
  const client = usePublicClient();
  const { data: nativeBalance } = useBalance({ address, query: { enabled: !!address } });
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!address || !chainId || !client) {
      setTokens([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const defaults = getDefaultTokens(chainId!);
        const customs = getCustomTokens(chainId!);

        const seen = new Set<string>();
        const all: (TokenInfo & { isCustom: boolean })[] = [];

        for (const t of defaults) {
          const k = t.address.toLowerCase();
          if (!seen.has(k)) {
            seen.add(k);
            all.push({ ...t, isCustom: false });
          }
        }
        for (const t of customs) {
          const k = t.address.toLowerCase();
          if (!seen.has(k)) {
            seen.add(k);
            all.push({ ...t, isCustom: true });
          }
        }

        const balances = await batchGetERC20Balances(
          client!,
          all,
          address!
        );

        if (cancelled) return;

        const result: TokenWithBalance[] = all.map((t, i) => ({
          ...t,
          balance: balances[i],
          formatted: formatUnits(balances[i], t.decimals),
        }));

        setTokens(result);
      } catch {
        if (!cancelled) setTokens([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, chainId, client, refreshKey]);

  const native: NativeTokenBalance | null = nativeBalance
    ? {
        symbol: nativeBalance.symbol,
        name: nativeBalance.symbol,
        decimals: nativeBalance.decimals,
        balance: nativeBalance.value,
        formatted: formatUnits(nativeBalance.value, nativeBalance.decimals),
      }
    : null;

  return { native, tokens, isLoading, refetch };
}
