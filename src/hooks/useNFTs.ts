"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { getTrackedNFTs, type NFTCollection } from "@/lib/tokens/nft-store";
import { getNFTBalance, getOwnedTokenIds, getTokenMetadata, type NFTMetadata } from "@/lib/tokens/erc721";

export type OwnedNFT = {
  contractAddress: `0x${string}`;
  collectionName: string;
  tokenId: bigint;
  metadata: NFTMetadata;
};

export type CollectionWithNFTs = {
  collection: NFTCollection;
  balance: number;
  nfts: OwnedNFT[];
};

export function useNFTs() {
  const { address, chainId } = useAccount();
  const client = usePublicClient();
  const [collections, setCollections] = useState<CollectionWithNFTs[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!address || !chainId || !client) {
      setCollections([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const tracked = getTrackedNFTs(chainId!);
        const results: CollectionWithNFTs[] = [];

        for (const collection of tracked) {
          if (cancelled) return;
          try {
            const balance = await getNFTBalance(client!, collection.address, address!);
            const balNum = Number(balance);

            const tokenIds = await getOwnedTokenIds(client!, collection.address, address!, balNum);
            const nfts: OwnedNFT[] = [];

            for (const tokenId of tokenIds) {
              if (cancelled) return;
              const metadata = await getTokenMetadata(client!, collection.address, tokenId);
              nfts.push({
                contractAddress: collection.address,
                collectionName: collection.name,
                tokenId,
                metadata,
              });
            }

            results.push({ collection, balance: balNum, nfts });
          } catch {
            results.push({ collection, balance: 0, nfts: [] });
          }
        }

        if (!cancelled) setCollections(results);
      } catch {
        if (!cancelled) setCollections([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [address, chainId, client, refreshKey]);

  return { collections, isLoading, refetch };
}
