"use client";

import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { shortenAddress } from "@/lib/utils";
import { Shield, Wallet, Zap, Key } from "lucide-react";

export default function AdminDashboard() {
  const account = useActiveAccount();
  const smartAccount = useSmartAccount();
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme } = useTheme();

  const cards = [
    {
      title: "Wallet",
      icon: Wallet,
      value: account ? shortenAddress(account.address) : "—",
      subtitle: account?.connector ?? "Not connected",
    },
    {
      title: "Smart Account",
      icon: Shield,
      value: smartAccount.address
        ? shortenAddress(smartAccount.address)
        : smartAccount.isLoading
          ? "Loading..."
          : "Not configured",
      subtitle: smartAccount.isEnabled ? "ERC-4337 Enabled" : "Bundler not set",
    },
    {
      title: "Session",
      icon: Key,
      value: isAuthenticated ? "Verified" : "Unsigned",
      subtitle: isAuthenticated
        ? "SIWE session active"
        : "Click 'Verify with Signature' in wallet panel",
    },
    {
      title: "Role",
      icon: Zap,
      value: isAdmin ? "Admin" : "User",
      subtitle: isAdmin ? "Full access" : "Limited access",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, icon: Icon, value, subtitle }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Icon className="h-4 w-4" />
              {title}
            </div>
            <p className="font-semibold font-mono text-sm">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Stack Info</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Framework</span>
          <span>Next.js 15 + React 19</span>
          <span className="text-muted-foreground">Web3</span>
          <span>wagmi + viem</span>
          <span className="text-muted-foreground">Embedded Wallet</span>
          <span>Web3Auth (MPC)</span>
          <span className="text-muted-foreground">Smart Accounts</span>
          <span>permissionless.js (ERC-4337)</span>
          <span className="text-muted-foreground">Auth</span>
          <span>NextAuth + SIWE</span>
          <span className="text-muted-foreground">Theme</span>
          <span className="capitalize">{theme}</span>
        </div>
      </div>
    </div>
  );
}
