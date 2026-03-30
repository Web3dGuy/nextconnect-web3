"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { signIn, signOut, useSession } from "next-auth/react";
import { createSiweMessage } from "@/lib/auth/siwe";
import { defaultChain } from "@/lib/web3/chains";
import { toast } from "sonner";

export function useAuth() {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: session, status: sessionStatus } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevAddress = useRef(address);

  // Invalidate session when wallet address changes
  useEffect(() => {
    if (
      prevAddress.current &&
      address &&
      prevAddress.current !== address &&
      sessionStatus === "authenticated"
    ) {
      signOut({ redirect: false });
    }
    prevAddress.current = address;
  }, [address, sessionStatus]);

  const signInWithEthereum = useCallback(async () => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected");
    }

    setIsSigningIn(true);
    setError(null);
    try {
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) {
        throw new Error(`Failed to fetch nonce: ${nonceRes.status}`);
      }
      const { nonce } = await nonceRes.json();
      if (!nonce || typeof nonce !== "string") {
        throw new Error("Invalid nonce received from server");
      }

      const message = createSiweMessage({
        address,
        chainId: chainId ?? defaultChain.id,
        nonce,
      });

      const messageStr = message.prepareMessage();
      const signature = await signMessageAsync({ message: messageStr });

      const result = await signIn("siwe", {
        message: messageStr,
        signature,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Authentication failed";
      let msg = raw;
      if (raw.includes("User rejected") || raw.includes("user rejected"))
        msg = "You declined the signature request.";
      else if (raw.includes("nonce"))
        msg = "Session expired — please try again.";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setIsSigningIn(false);
    }
  }, [address, isConnected, chainId, signMessageAsync]);

  const signOutUser = useCallback(async () => {
    await signOut({ redirect: false });
    setError(null);
  }, []);

  const isAdmin = useMemo(() => {
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();
    if (!adminWallet || !address) return false;
    return address.toLowerCase() === adminWallet;
  }, [address]);

  const isAuthenticated = sessionStatus === "authenticated";

  return {
    address,
    isConnected,
    session,
    sessionStatus,
    isAuthenticated,
    isSigningIn,
    isAdmin,
    error,
    signInWithEthereum,
    signOut: signOutUser,
  };
}
