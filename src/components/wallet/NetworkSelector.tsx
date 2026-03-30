"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN_GROUPS, getChainById, isTestnet } from "@/lib/web3/chains";
import { toast } from "sonner";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";

export function NetworkSelector() {
  const { chainId } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const currentChain = chainId ? getChainById(chainId) : undefined;

  const lastErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (error) {
      const msg =
        error.message.includes("User rejected") || error.message.includes("user rejected")
          ? "Chain switch was declined."
          : "Failed to switch network.";
      if (lastErrorRef.current !== error.message) {
        lastErrorRef.current = error.message;
        toast.error(msg);
      }
    } else {
      lastErrorRef.current = null;
    }
  }, [error]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [open]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [open, handleClickOutside]);

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return CHAIN_GROUPS;
    return CHAIN_GROUPS.map((group) => ({
      ...group,
      chains: group.chains.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toString().includes(q)
      ),
    })).filter((g) => g.chains.length > 0);
  }, [search]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Switch network"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md border border-border px-2.5 py-1.5 hover:bg-accent"
      >
        {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
        <span className="font-medium max-w-[120px] truncate">
          {currentChain?.name ?? `Chain ${chainId}`}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-[260px] rounded-lg border border-border bg-card shadow-lg overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search networks..."
                className="w-full h-8 pl-7 pr-2 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto py-1" role="listbox" aria-label="Network selection">
            {filteredGroups.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No networks found</p>
            )}
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </div>
                {group.chains.map((chain) => (
                  <button
                    key={chain.id}
                    role="option"
                    aria-selected={chain.id === chainId}
                    disabled={isPending || chain.id === chainId}
                    onClick={() => {
                      switchChain({ chainId: chain.id });
                      setOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>{chain.name}</span>
                      {isTestnet(chain.id) && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-warning/15 text-warning font-medium">
                          testnet
                        </span>
                      )}
                    </span>
                    {chain.id === chainId && <Check className="h-3 w-3 text-success shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
