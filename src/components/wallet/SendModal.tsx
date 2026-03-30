"use client";

import { useState, useMemo } from "react";
import { isAddress, parseUnits, encodeFunctionData, erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useTokenBalances, type TokenWithBalance, type NativeTokenBalance } from "@/hooks/useTokenBalances";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { getChainById } from "@/lib/web3/chains";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Search, ChevronDown, ExternalLink, Coins } from "lucide-react";

type SendableToken =
  | { type: "native"; symbol: string; decimals: number; balance: bigint; formatted: string }
  | { type: "erc20"; address: `0x${string}`; symbol: string; name: string; decimals: number; balance: bigint; formatted: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SendModal({ open, onOpenChange }: Props) {
  const { chainId } = useAccount();
  const smartAccount = useSmartAccount();
  const { native, tokens } = useTokenBalances();
  const { addTx } = useTransactionHistory();

  const [selectedToken, setSelectedToken] = useState<SendableToken | null>(null);
  const [tokenPickerOpen, setTokenPickerOpen] = useState(false);
  const [tokenSearch, setTokenSearch] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chain = chainId ? getChainById(chainId) : undefined;
  const explorerUrl = chain?.blockExplorers?.default.url;

  const sendableTokens: SendableToken[] = useMemo(() => {
    const list: SendableToken[] = [];
    if (native) {
      list.push({ type: "native", symbol: native.symbol, decimals: native.decimals, balance: native.balance, formatted: native.formatted });
    }
    for (const t of tokens) {
      list.push({ type: "erc20", address: t.address, symbol: t.symbol, name: t.name, decimals: t.decimals, balance: t.balance, formatted: t.formatted });
    }
    return list;
  }, [native, tokens]);

  const filteredTokens = useMemo(() => {
    if (!tokenSearch.trim()) return sendableTokens;
    const q = tokenSearch.toLowerCase();
    return sendableTokens.filter((t) =>
      t.symbol.toLowerCase().includes(q) ||
      (t.type === "erc20" && t.name.toLowerCase().includes(q))
    );
  }, [sendableTokens, tokenSearch]);

  const active = selectedToken ?? sendableTokens[0] ?? null;

  const handleMax = () => {
    if (!active) return;
    setAmount(active.formatted);
  };

  const handleSend = async () => {
    if (!active || !to || !amount || !smartAccount.sendTransaction) return;

    if (!isAddress(to)) {
      setError("Invalid recipient address");
      return;
    }

    let parsedValue: bigint;
    try {
      parsedValue = parseUnits(amount, active.decimals);
    } catch {
      setError("Invalid amount");
      return;
    }

    setSending(true);
    setError(null);
    setTxHash(null);

    try {
      let hash: `0x${string}`;

      if (active.type === "native") {
        hash = await smartAccount.sendTransaction({
          to: to as `0x${string}`,
          value: parsedValue,
        });
      } else {
        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [to as `0x${string}`, parsedValue],
        });
        hash = await smartAccount.sendTransaction({
          to: active.address,
          data,
          value: 0n,
        });
      }

      setTxHash(hash);
      addTx({
        hash,
        to,
        value: amount,
        tokenSymbol: active.symbol,
      });
      setTo("");
      setAmount("");
      toast.success("Transaction sent!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setError(msg.length > 120 ? msg.slice(0, 120) + "..." : msg);
      toast.error("Transaction failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Send</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Token Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Token</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTokenPickerOpen(!tokenPickerOpen)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background flex items-center justify-between text-sm hover:bg-accent transition-colors"
              >
                <span className="flex items-center gap-2">
                  {active?.type === "native" ? (
                    <Coins className="h-4 w-4 text-primary" />
                  ) : null}
                  <span>{active?.symbol ?? "Select token"}</span>
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${tokenPickerOpen ? "rotate-180" : ""}`} />
              </button>

              {tokenPickerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTokenPickerOpen(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={tokenSearch}
                          onChange={(e) => setTokenSearch(e.target.value)}
                          placeholder="Search tokens..."
                          className="w-full h-8 pl-7 pr-2 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto py-1">
                      {filteredTokens.map((t, i) => (
                        <button
                          key={t.type === "erc20" ? t.address : "native"}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-accent transition-colors flex items-center justify-between"
                          onClick={() => {
                            setSelectedToken(t);
                            setTokenPickerOpen(false);
                            setTokenSearch("");
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {t.type === "native" && <Coins className="h-3.5 w-3.5 text-primary" />}
                            <span className="font-medium">{t.symbol}</span>
                            {t.type === "erc20" && (
                              <span className="text-muted-foreground">{t.name}</span>
                            )}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {Number(t.formatted) > 0 ? Number(t.formatted).toFixed(4) : "0"}
                          </span>
                        </button>
                      ))}
                      {filteredTokens.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No tokens found</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Recipient</label>
            <input
              type="text"
              placeholder="0x..."
              value={to}
              onChange={(e) => { setTo(e.target.value); setError(null); }}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Amount</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="outline" size="sm" onClick={handleMax} className="h-10 text-xs">
                Max
              </Button>
            </div>
            {active && (
              <p className="text-[11px] text-muted-foreground">
                Balance: {Number(active.formatted).toFixed(4)} {active.symbol}
              </p>
            )}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          {txHash && (
            <div className="flex items-center gap-2 text-xs text-success rounded-md bg-success/10 px-3 py-2">
              <span className="truncate">Sent: {txHash.slice(0, 14)}...{txHash.slice(-8)}</span>
              {explorerUrl && (
                <a href={`${explorerUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <Button
            className="w-full"
            disabled={sending || !to || !amount || !smartAccount.sendTransaction}
            onClick={handleSend}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !smartAccount.sendTransaction ? (
              "Smart account not available"
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
