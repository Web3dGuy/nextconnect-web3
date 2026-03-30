"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConnectButton } from "@/components/connect/ConnectButton";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useAuth } from "@/hooks/useAuth";
import { getChainById } from "@/lib/web3/chains";
import { Loader2 } from "lucide-react";

export default function Home() {
  const account = useActiveAccount();
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (account && isAdmin && isAuthenticated) {
      router.push("/admin");
    }
  }, [account, isAdmin, isAuthenticated, router]);

  const isRedirecting = account && isAdmin && isAuthenticated;

  const nativeSymbol = account?.chainId
    ? (getChainById(account.chainId)?.nativeCurrency.symbol ?? "ETH")
    : "ETH";

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Next<span className="text-brand">Connect</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Open-source web3 auth, wallets, and smart accounts — no vendor lock-in.
        </p>

        {isRedirecting ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Redirecting to admin...</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <ConnectButton appName="NextConnect" />
          </div>
        )}

        {account && !isRedirecting && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Connected as{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </code>
            </p>
            {account.balanceFormatted && (
              <p>
                Balance: {Number(account.balanceFormatted).toFixed(4)} {nativeSymbol}
              </p>
            )}
          </div>
        )}

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {[
            "wagmi + viem",
            "Web3Auth Social Login",
            "ERC-4337 Smart Accounts",
            "NextAuth SIWE",
            "Gas Sponsorship",
            "Multi-Theme",
          ].map((feature) => (
            <span
              key={feature}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
