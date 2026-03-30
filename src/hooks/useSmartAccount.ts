"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { createNextConnectSmartAccount } from "@/lib/smart-account/client";
import { BUNDLER_URL, FACTORY_ADDRESS } from "@/lib/web3/constants";
import { getChainById } from "@/lib/web3/chains";

type SmartAccountState = {
  address: `0x${string}` | null;
  isLoading: boolean;
  error: Error | null;
  isEnabled: boolean;
  sendTransaction: ((tx: { to: `0x${string}`; data?: `0x${string}`; value?: bigint }) => Promise<`0x${string}`>) | null;
};

export function useSmartAccount(): SmartAccountState {
  const { isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [smartAddress, setSmartAddress] = useState<`0x${string}` | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [smartClient, setSmartClient] = useState<Awaited<
    ReturnType<typeof createNextConnectSmartAccount>
  > | null>(null);

  const isEnabled = Boolean(BUNDLER_URL);

  useEffect(() => {
    if (!isConnected || !walletClient || !isEnabled) {
      setSmartAddress(null);
      setSmartClient(null);
      return;
    }

    let cancelled = false;

    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const chain = chainId ? getChainById(chainId) : undefined;
        const result = await createNextConnectSmartAccount({
          signer: walletClient!,
          ...(FACTORY_ADDRESS ? { factoryAddress: FACTORY_ADDRESS } : {}),
          ...(chain ? { chain } : {}),
          sponsorGas: true,
        });
        if (!cancelled) {
          setSmartAddress(result.address);
          setSmartClient(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [isConnected, walletClient, isEnabled, chainId]);

  const sendTransaction = useCallback(
    async (tx: { to: `0x${string}`; data?: `0x${string}`; value?: bigint }) => {
      if (!smartClient) throw new Error("Smart account not initialized");
      const hash = await smartClient.client.sendTransaction({
        to: tx.to,
        data: tx.data ?? "0x",
        value: tx.value ?? 0n,
      });
      return hash;
    },
    [smartClient]
  );

  return {
    address: smartAddress,
    isLoading,
    error,
    isEnabled,
    sendTransaction: smartClient ? sendTransaction : null,
  };
}
