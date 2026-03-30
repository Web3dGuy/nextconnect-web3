"use client";

import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useAccount } from "wagmi";
import { getChainById } from "@/lib/web3/chains";
import { shortenAddress } from "@/lib/utils";
import { ExternalLink, ArrowUpRight, Loader2, Check, X, Clock } from "lucide-react";

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return <Check className="h-3.5 w-3.5 text-success" />;
    case "failed":
      return <X className="h-3.5 w-3.5 text-destructive" />;
    default:
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-warning" />;
  }
}

export function TransactionList() {
  const { chainId } = useAccount();
  const { transactions, isLoading } = useTransactionHistory();
  const chain = chainId ? getChainById(chainId) : undefined;
  const explorerUrl = chain?.blockExplorers?.default.url;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          No transactions yet. Transactions sent through this app will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Checking pending transactions...</span>
        </div>
      )}
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/50 transition-colors"
        >
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-accent shrink-0">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">Send</span>
              {tx.tokenSymbol && (
                <span className="text-xs text-muted-foreground">{tx.tokenSymbol}</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              To: {shortenAddress(tx.to)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <StatusIcon status={tx.status} />
                <span className="text-[11px] text-muted-foreground capitalize">{tx.status}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{relativeTime(tx.timestamp)}</p>
            </div>
            {explorerUrl && (
              <a
                href={`${explorerUrl}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
