"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useNFTs, type OwnedNFT } from "@/hooks/useNFTs";
import { addTrackedNFT, removeTrackedNFT } from "@/lib/tokens/nft-store";
import { getNFTCollectionMeta } from "@/lib/tokens/erc721";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, RefreshCw, Image, Trash2 } from "lucide-react";

function NFTCard({ nft }: { nft: OwnedNFT }) {
  const [imgError, setImgError] = useState(false);
  const name = nft.metadata.name ?? `#${nft.tokenId.toString()}`;

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card hover:border-primary/30 transition-colors">
      <div className="aspect-square bg-accent/30 flex items-center justify-center">
        {nft.metadata.image && !imgError ? (
          <img
            src={nft.metadata.image}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{nft.collectionName}</p>
      </div>
    </div>
  );
}

export function NFTGallery() {
  const { chainId } = useAccount();
  const client = usePublicClient();
  const { collections, isLoading, refetch } = useNFTs();
  const [adding, setAdding] = useState(false);
  const [contractInput, setContractInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCollection = async () => {
    if (!contractInput || !client || !chainId) return;
    if (!isAddress(contractInput)) {
      setError("Invalid address");
      return;
    }

    setLookupLoading(true);
    setError(null);
    try {
      const meta = await getNFTCollectionMeta(client, contractInput as `0x${string}`);
      addTrackedNFT(chainId, {
        address: contractInput as `0x${string}`,
        name: meta.name,
        symbol: meta.symbol,
      });
      setContractInput("");
      setAdding(false);
      refetch();
    } catch {
      setError("Could not read NFT contract — verify it's a valid ERC721 on this chain");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleRemoveCollection = (address: string) => {
    if (!chainId) return;
    removeTrackedNFT(chainId, address);
    refetch();
  };

  const allNFTs = collections.flatMap((c) => c.nfts);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-xs text-muted-foreground">
          {collections.length} collection{collections.length !== 1 ? "s" : ""}
          {" / "}
          {allNFTs.length} NFT{allNFTs.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => setAdding(true)}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Add collection"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {adding && (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Add NFT Collection</span>
            <button onClick={() => { setAdding(false); setError(null); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ERC721 contract address 0x..."
              value={contractInput}
              onChange={(e) => { setContractInput(e.target.value); setError(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCollection(); }}
              className="flex-1 h-8 px-2 rounded border border-border bg-background text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button size="sm" onClick={handleAddCollection} disabled={lookupLoading || !contractInput} className="h-8 px-3 text-xs">
              {lookupLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
            </Button>
          </div>
          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>
      )}

      {collections.length > 0 && (
        <div className="space-y-1">
          {collections.map((c) => (
            <div key={c.collection.address} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-accent/50 group">
              <span className="truncate">
                <span className="font-medium">{c.collection.name}</span>
                <span className="text-muted-foreground ml-1">({c.balance})</span>
              </span>
              <button
                onClick={() => handleRemoveCollection(c.collection.address)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                title="Remove collection"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {allNFTs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allNFTs.map((nft) => (
            <NFTCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-8 space-y-2">
          <Image className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            {collections.length === 0
              ? "Add an NFT collection by contract address to view your NFTs."
              : "No NFTs found in tracked collections."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
