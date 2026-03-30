"use client";

import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

export type ActiveAccount = {
  address: `0x${string}`;
  isConnected: true;
  chainId: number | undefined;
  balance: string | undefined;
  balanceFormatted: string | undefined;
  connector: string | undefined;
};

/**
 * Drop-in replacement for thirdweb's `useActiveAccount`.
 * Returns the connected account or null.
 */
export function useActiveAccount(): ActiveAccount | null {
  const { address, isConnected, chainId, connector } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: { enabled: isConnected },
  });

  if (!isConnected || !address) return null;

  return {
    address,
    isConnected: true,
    chainId,
    balance: balanceData?.value.toString(),
    balanceFormatted: balanceData
      ? formatEther(balanceData.value)
      : undefined,
    connector: connector?.name,
  };
}
