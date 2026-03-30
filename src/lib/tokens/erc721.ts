import { type PublicClient } from "viem";

const ERC721_ABI = [
  { inputs: [], name: "name", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "owner", type: "address" }, { name: "index", type: "uint256" }], name: "tokenOfOwnerByIndex", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "tokenId", type: "uint256" }], name: "tokenURI", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
] as const;

export async function getNFTCollectionMeta(
  client: PublicClient,
  contractAddress: `0x${string}`
): Promise<{ name: string; symbol: string }> {
  const [name, symbol] = await Promise.all([
    client.readContract({ address: contractAddress, abi: ERC721_ABI, functionName: "name" }),
    client.readContract({ address: contractAddress, abi: ERC721_ABI, functionName: "symbol" }),
  ]);
  return { name, symbol };
}

export async function getNFTBalance(
  client: PublicClient,
  contractAddress: `0x${string}`,
  owner: `0x${string}`
): Promise<bigint> {
  return client.readContract({
    address: contractAddress,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: [owner],
  });
}

export async function getOwnedTokenIds(
  client: PublicClient,
  contractAddress: `0x${string}`,
  owner: `0x${string}`,
  balance: number,
  maxTokens = 20
): Promise<bigint[]> {
  const count = Math.min(balance, maxTokens);
  const ids: bigint[] = [];

  try {
    for (let i = 0; i < count; i++) {
      const tokenId = await client.readContract({
        address: contractAddress,
        abi: ERC721_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [owner, BigInt(i)],
      });
      ids.push(tokenId);
    }
  } catch {
    // Contract doesn't support ERC721Enumerable — return empty
  }

  return ids;
}

export type NFTMetadata = {
  name?: string;
  description?: string;
  image?: string;
};

export async function getTokenMetadata(
  client: PublicClient,
  contractAddress: `0x${string}`,
  tokenId: bigint
): Promise<NFTMetadata> {
  try {
    const uri = await client.readContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: "tokenURI",
      args: [tokenId],
    });

    let metadataUrl = uri;
    if (metadataUrl.startsWith("ipfs://")) {
      metadataUrl = metadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    const res = await fetch(metadataUrl);
    if (!res.ok) return {};
    const json = await res.json();

    let image = json.image as string | undefined;
    if (image?.startsWith("ipfs://")) {
      image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return {
      name: json.name as string | undefined,
      description: json.description as string | undefined,
      image,
    };
  } catch {
    return {};
  }
}
