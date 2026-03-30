"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useTokenBalances, type TokenWithBalance } from "@/hooks/useTokenBalances";
import { removeCustomToken } from "@/lib/tokens/token-store";
import { AddTokenForm } from "./AddTokenForm";
import { Search, Plus, RefreshCw, Trash2, Coins } from "lucide-react";

function TokenIcon({ symbol }: { symbol: string }) {
  const hue = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  }, [symbol]);

  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ background: `hsl(${hue}, 55%, 50%)` }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

function TokenRow({ token, onRemove }: { token: TokenWithBalance; onRemove?: () => void }) {
  const bal = Number(token.formatted);
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/50 transition-colors group">
      <TokenIcon symbol={token.symbol} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{token.symbol}</p>
        <p className="text-xs text-muted-foreground truncate">{token.name}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <span className="text-sm font-mono tabular-nums">
          {bal > 0 ? (bal < 0.0001 ? "<0.0001" : bal.toFixed(4)) : "0"}
        </span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            title="Remove token"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function TokenList() {
  const { chainId } = useAccount();
  const { native, tokens, isLoading, refetch } = useTokenBalances();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return tokens;
    const q = search.toLowerCase();
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }, [tokens, search]);

  const handleRemove = (token: TokenWithBalance) => {
    if (!chainId) return;
    removeCustomToken(chainId, token.address);
    refetch();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens..."
            className="w-full h-8 pl-8 pr-2 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
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
          title="Add token"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {adding && (
        <AddTokenForm
          onAdded={() => {
            setAdding(false);
            refetch();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-0.5">
        {native && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/50 transition-colors">
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-primary shrink-0">
              <Coins className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{native.symbol}</p>
              <p className="text-xs text-muted-foreground">Native token</p>
            </div>
            <span className="text-sm font-mono tabular-nums">
              {Number(native.formatted).toFixed(4)}
            </span>
          </div>
        )}

        {filtered.map((token) => (
          <TokenRow
            key={token.address}
            token={token}
            onRemove={token.isCustom ? () => handleRemove(token) : undefined}
          />
        ))}

        {!isLoading && filtered.length === 0 && !native && (
          <p className="text-center text-xs text-muted-foreground py-6">
            No tokens found
          </p>
        )}
      </div>
    </div>
  );
}
