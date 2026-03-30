"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  getTransactions,
  addTransaction as storeAddTx,
  updateTransactionStatus,
  type StoredTransaction,
} from "@/lib/transactions/tx-store";

const POLL_INTERVAL = 10_000;

export function useTransactionHistory() {
  const { address, chainId } = useAccount();
  const client = usePublicClient();
  const [transactions, setTransactions] = useState<StoredTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(() => {
    if (!address || !chainId) {
      setTransactions([]);
      return;
    }
    setTransactions(getTransactions(chainId, address));
  }, [address, chainId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!address || !chainId || !client) return;

    let cancelled = false;

    async function pollPending() {
      const txs = getTransactions(chainId!, address!);
      const pending = txs.filter((tx) => tx.status === "pending");
      if (pending.length === 0) return;

      setIsLoading(true);
      for (const tx of pending) {
        if (cancelled) return;
        try {
          const receipt = await client!.getTransactionReceipt({ hash: tx.hash });
          const newStatus = receipt.status === "success" ? "confirmed" : "failed";
          updateTransactionStatus(chainId!, address!, tx.hash, newStatus as "confirmed" | "failed");
        } catch {
          // Still pending or error — leave as is
        }
      }
      if (!cancelled) {
        setTransactions(getTransactions(chainId!, address!));
        setIsLoading(false);
      }
    }

    pollPending();
    const interval = setInterval(pollPending, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, chainId, client, transactions.length]);

  const addTx = useCallback(
    (tx: Omit<StoredTransaction, "timestamp" | "status" | "chainId">) => {
      if (!address || !chainId) return;
      const stored: StoredTransaction = {
        ...tx,
        timestamp: Date.now(),
        status: "pending",
        chainId,
      };
      storeAddTx(chainId, address, stored);
      setTransactions(getTransactions(chainId, address));
    },
    [address, chainId]
  );

  return { transactions, isLoading, addTx, reload };
}
