"use client";

import { useMemo, useCallback } from "react";
import { useConnect as useWagmiConnect, useDisconnect as useWagmiDisconnect } from "wagmi";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { getWeb3Auth } from "@/lib/web3/web3auth";
import { toast } from "sonner";
import type { injected } from "wagmi/connectors";

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const cause =
    err instanceof Error && err.cause instanceof Error
      ? err.cause.message
      : "";
  const full = `${msg} ${cause}`;

  if (full.includes("digest") || full.includes("subtle"))
    return "Crypto API unavailable — use localhost or HTTPS (not plain HTTP on a LAN IP).";
  if (full.includes("User rejected") || full.includes("user rejected"))
    return "Connection request was declined.";
  if (full.includes("Already processing"))
    return "A connection request is already pending in your wallet.";
  if (full.includes("something went wrong") || full.includes("Something went wrong"))
    return "Something went wrong with the login provider. Please try again.";
  return msg.length > 120 ? msg.slice(0, 120) + "..." : msg;
}

export function useConnect() {
  const { connect: rawConnect, connectors, isPending, error } = useWagmiConnect();
  const { disconnect } = useWagmiDisconnect();

  const connect: typeof rawConnect = useCallback(
    (variables, options) => {
      rawConnect(variables, {
        ...options,
        onError: (err, ...rest) => {
          toast.error(friendlyError(err));
          options?.onError?.(err, ...rest);
        },
      });
    },
    [rawConnect]
  );

  const walletConnectors = useMemo(
    () =>
      connectors.filter(
        (c) =>
          !c.id.startsWith("web3auth-") &&
          !(c.id === "injected" && c.name === "Injected")
      ),
    [connectors]
  );

  const socialConnectors = useMemo(
    () =>
      connectors.filter(
        (c) => c.id.startsWith("web3auth-") && c.id !== "web3auth-email"
      ),
    [connectors]
  );

  const hasSocialLogin = useMemo(
    () => connectors.some((c) => c.id.startsWith("web3auth-")),
    [connectors]
  );

  const connectWithEmail = useCallback(
    (email: string, callbacks?: { onSettled?: () => void }) => {
      if (!email.trim()) return;
      try {
        const web3auth = getWeb3Auth();
        const connector = Web3AuthConnector({
          web3AuthInstance: web3auth,
          loginParams: {
            loginProvider: "email_passwordless",
            login_hint: email.trim(),
          },
          id: "web3auth-email",
          name: "Email",
        }) as ReturnType<typeof injected>;

        connect({ connector }, {
          onSettled: callbacks?.onSettled,
        });
      } catch (err) {
        toast.error(friendlyError(err));
        callbacks?.onSettled?.();
      }
    },
    [connect]
  );

  return {
    connect,
    disconnect,
    connectors,
    walletConnectors,
    socialConnectors,
    hasSocialLogin,
    connectWithEmail,
    isPending,
    error,
  };
}
