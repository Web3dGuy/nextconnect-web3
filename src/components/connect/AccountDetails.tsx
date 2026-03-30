"use client";

import { useState, useEffect, useRef } from "react";
import { useDisconnect, useAccount, useSwitchChain } from "wagmi";
import { parseEther, isAddress } from "viem";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { shortenAddress, copyToClipboard } from "@/lib/utils";
import { getChainById, supportedChains } from "@/lib/web3/chains";
import { toast } from "sonner";
import {
  Copy,
  Check,
  LogOut,
  Shield,
  Wallet,
  Fingerprint,
  ExternalLink,
  Loader2,
  ChevronDown,
  Send,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy address"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function ExplorerLink({ address, chainId, type = "address" }: { address: string; chainId?: number; type?: "address" | "tx" }) {
  const chain = chainId ? getChainById(chainId) : undefined;
  const explorerUrl = chain?.blockExplorers?.default.url;
  if (!explorerUrl) return null;

  return (
    <a
      href={`${explorerUrl}/${type}/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View on explorer"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function UnsupportedNetworkBanner() {
  const { chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const isSupported = chainId ? !!getChainById(chainId) : true;

  if (isSupported) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-xs">
      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
      <span className="flex-1">Unsupported network (ID: {chainId})</span>
      <button
        disabled={isPending}
        onClick={() => switchChain({ chainId: supportedChains[0].id })}
        className="font-medium text-primary hover:underline disabled:opacity-50"
      >
        {isPending ? "Switching..." : `Switch to ${supportedChains[0].name}`}
      </button>
    </div>
  );
}

function ChainSwitcher() {
  const { chainId } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const currentChain = chainId ? getChainById(chainId) : undefined;

  const lastErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (error) {
      const msg = error.message.includes("User rejected") || error.message.includes("user rejected")
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
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Switch network"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
        <span className="font-medium">{currentChain?.name ?? `Chain ${chainId}`}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            aria-label="Network selection"
            className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border bg-card shadow-lg py-1"
          >
            {supportedChains.map((chain) => (
              <button
                key={chain.id}
                role="option"
                aria-selected={chain.id === chainId}
                disabled={isPending || chain.id === chainId}
                onClick={() => {
                  switchChain({ chainId: chain.id });
                  setOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-between"
              >
                <span>{chain.name}</span>
                {chain.id === chainId && <Check className="h-3 w-3 text-success" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SendForm({ chainId }: { chainId?: number }) {
  const smartAccount = useSmartAccount();
  const [expanded, setExpanded] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  if (!smartAccount.sendTransaction) return null;

  const handleSend = async () => {
    if (!to || !amount) return;
    if (!isAddress(to)) {
      setSendError("Invalid address");
      return;
    }
    let parsedValue: bigint;
    try {
      parsedValue = parseEther(amount);
    } catch {
      setSendError("Invalid amount");
      return;
    }
    setSending(true);
    setSendError(null);
    setTxHash(null);
    try {
      const hash = await smartAccount.sendTransaction!({
        to: to as `0x${string}`,
        value: parsedValue,
      });
      setTxHash(hash);
      setTo("");
      setAmount("");
      toast.success("Transaction sent!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setSendError(msg);
      toast.error("Transaction failed");
    } finally {
      setSending(false);
    }
  };

  if (!expanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={() => setExpanded(true)}
      >
        <Send className="h-3.5 w-3.5" />
        Send
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Send (Smart Account)</span>
        <button
          onClick={() => { setExpanded(false); setSendError(null); setTxHash(null); }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
      <input
        type="text"
        placeholder="Recipient 0x..."
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full h-8 px-2 rounded border border-border bg-background text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 h-8 px-2 rounded border border-border bg-background text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button size="sm" disabled={sending || !to || !amount} onClick={handleSend} className="h-8 px-3 text-xs">
          {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send"}
        </Button>
      </div>
      {txHash && (
        <div className="flex items-center gap-1.5 text-[11px] text-success">
          <span className="truncate">Tx: {txHash.slice(0, 14)}...{txHash.slice(-8)}</span>
          <ExplorerLink address={txHash} chainId={chainId} type="tx" />
        </div>
      )}
      {sendError && (
        <p className="text-[11px] text-destructive truncate">{sendError}</p>
      )}
    </div>
  );
}

export function AccountDetails() {
  const account = useActiveAccount();
  const smartAccount = useSmartAccount();
  const { isAuthenticated, isAdmin, isSigningIn, error: authError, signInWithEthereum, signOut } = useAuth();
  const { disconnectAsync } = useDisconnect();
  const [disconnecting, setDisconnecting] = useState(false);

  if (!account) return null;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      if (isAuthenticated) await signOut();
      await disconnectAsync();
    } finally {
      setDisconnecting(false);
    }
  };

  const nativeSymbol = account.chainId
    ? (getChainById(account.chainId)?.nativeCurrency.symbol ?? "ETH")
    : "ETH";

  return (
    <div className="space-y-3">
      {/* Unsupported network warning */}
      <UnsupportedNetworkBanner />

      {/* EOA Address */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="h-3 w-3" />
            <span>Wallet</span>
            {account.connector && (
              <span className="opacity-60">via {account.connector}</span>
            )}
          </div>
          <ChainSwitcher />
        </div>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono">
            {shortenAddress(account.address)}
          </code>
          <CopyButton text={account.address} />
          <ExplorerLink address={account.address} chainId={account.chainId} />
        </div>
        {account.balanceFormatted && (
          <p className="text-xs text-muted-foreground">
            {Number(account.balanceFormatted).toFixed(4)} {nativeSymbol}
          </p>
        )}
      </div>

      {/* Smart Account */}
      {smartAccount.isEnabled && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Smart Account</span>
              {smartAccount.isLoading && (
                <Loader2 className="h-3 w-3 animate-spin ml-auto" />
              )}
              {smartAccount.address && !smartAccount.isLoading && (
                <span className="ml-auto text-[10px] text-success">Active</span>
              )}
            </div>
            {smartAccount.address && (
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono">
                  {shortenAddress(smartAccount.address)}
                </code>
                <CopyButton text={smartAccount.address} />
                <ExplorerLink address={smartAccount.address} chainId={account.chainId} />
              </div>
            )}
            {smartAccount.error && (
              <div className="flex items-center gap-1.5 text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <p className="text-xs truncate">
                  {smartAccount.error.message}
                </p>
              </div>
            )}
            <SendForm chainId={account.chainId} />
          </div>
        </>
      )}

      <Separator />

      {/* Auth State */}
      <div className="space-y-2">
        {!isAuthenticated ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={signInWithEthereum}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Fingerprint className="h-4 w-4" />
              )}
              {isSigningIn ? "Signing..." : "Verify with Signature"}
            </Button>
            {authError && (
              <div className="flex items-center gap-1.5 text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <p className="text-xs truncate">{authError}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-success">
            <Check className="h-3 w-3" />
            <span>Session verified</span>
            {isAdmin && (
              <span className="ml-auto bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                ADMIN
              </span>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-destructive hover:text-destructive"
          onClick={handleDisconnect}
          disabled={disconnecting}
        >
          {disconnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {disconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </div>
    </div>
  );
}
