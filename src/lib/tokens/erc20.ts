import { type PublicClient, erc20Abi } from "viem";

export async function getERC20Balance(
  client: PublicClient,
  tokenAddress: `0x${string}`,
  owner: `0x${string}`
): Promise<bigint> {
  return client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [owner],
  });
}

export async function getERC20Metadata(
  client: PublicClient,
  tokenAddress: `0x${string}`
): Promise<{ name: string; symbol: string; decimals: number }> {
  const [name, symbol, decimals] = await Promise.all([
    client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "name",
    }),
    client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "symbol",
    }),
    client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "decimals",
    }),
  ]);

  return { name, symbol, decimals };
}

export async function batchGetERC20Balances(
  client: PublicClient,
  tokens: { address: `0x${string}` }[],
  owner: `0x${string}`
): Promise<bigint[]> {
  if (tokens.length === 0) return [];

  const results = await client.multicall({
    contracts: tokens.map((t) => ({
      address: t.address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [owner] as const,
    })),
    allowFailure: true,
  });

  return results.map((r) =>
    r.status === "success" ? (r.result as bigint) : 0n
  );
}
