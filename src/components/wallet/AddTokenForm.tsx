"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { getERC20Metadata } from "@/lib/tokens/erc20";
import { addCustomToken } from "@/lib/tokens/token-store";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";

type Props = {
  onAdded: () => void;
  onCancel: () => void;
};

export function AddTokenForm({ onAdded, onCancel }: Props) {
  const { chainId } = useAccount();
  const client = usePublicClient();
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ name: string; symbol: string; decimals: number } | null>(null);

  const handleLookup = async () => {
    if (!contractAddress || !client || !chainId) return;

    if (!isAddress(contractAddress)) {
      setError("Invalid address");
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const meta = await getERC20Metadata(client, contractAddress as `0x${string}`);
      setPreview(meta);
    } catch {
      setError("Could not read token — verify it's a valid ERC20 contract on this chain");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview || !chainId) return;

    addCustomToken(chainId, {
      address: contractAddress as `0x${string}`,
      symbol: preview.symbol,
      name: preview.name,
      decimals: preview.decimals,
      chainId,
    });

    onAdded();
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Add Custom Token</span>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Contract address 0x..."
          value={contractAddress}
          onChange={(e) => {
            setContractAddress(e.target.value);
            setPreview(null);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLookup();
          }}
          className="flex-1 h-8 px-2 rounded border border-border bg-background text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button size="sm" onClick={handleLookup} disabled={loading || !contractAddress} className="h-8 px-3 text-xs">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Lookup"}
        </Button>
      </div>

      {error && <p className="text-[11px] text-destructive">{error}</p>}

      {preview && (
        <div className="flex items-center justify-between rounded-md bg-accent/50 px-3 py-2">
          <div>
            <p className="text-sm font-medium">{preview.symbol}</p>
            <p className="text-xs text-muted-foreground">{preview.name} ({preview.decimals} decimals)</p>
          </div>
          <Button size="sm" onClick={handleAdd} className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
