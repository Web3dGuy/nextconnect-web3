"use client";

import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useTheme, THEMES, type Theme } from "@/hooks/useTheme";
import { FACTORY_ADDRESS, BUNDLER_URL, PAYMASTER_URL } from "@/lib/web3/constants";
import { defaultChain } from "@/lib/web3/chains";
import { Check, AlertTriangle } from "lucide-react";

const THEME_LABELS: Record<Theme, string> = {
  "gruvbox-light": "Gruvbox Light",
  "gruvbox-dark": "Gruvbox Dark",
  "nord-light": "Nord Light",
  "nord-dark": "Nord Dark",
  "everforest-light": "Everforest Light",
  "everforest-dark": "Everforest Dark",
  "catppuccin-latte": "Catppuccin Latte",
  "catppuccin-mocha": "Catppuccin Mocha",
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-warning" />
      )}
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const account = useActiveAccount();
  const smartAccount = useSmartAccount();
  const { theme, setTheme } = useTheme();

  const hasWeb3Auth = Boolean(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID);
  const hasWalletConnect = Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);
  const hasBundler = Boolean(BUNDLER_URL);
  const hasPaymaster = Boolean(PAYMASTER_URL);

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Theme */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                theme === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Status */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Feature Status</h2>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <StatusBadge ok={true} label="External wallets (MetaMask, Coinbase)" />
          <StatusBadge ok={hasWalletConnect} label="WalletConnect" />
          <StatusBadge ok={hasWeb3Auth} label="Social login (Web3Auth)" />
          <StatusBadge ok={hasBundler} label="Smart accounts (bundler)" />
          <StatusBadge ok={hasPaymaster} label="Gas sponsorship (paymaster)" />
          <StatusBadge ok={true} label="SIWE sessions (NextAuth)" />
        </div>
      </section>

      {/* Chain & Contract Config */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Network Configuration</h2>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chain</span>
            <span className="font-mono">
              {defaultChain.name} ({defaultChain.id})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Factory</span>
            <span className="font-mono text-xs">
              {FACTORY_ADDRESS
                ? `${FACTORY_ADDRESS.slice(0, 10)}...${FACTORY_ADDRESS.slice(-8)}`
                : "Default (canonical)"}
            </span>
          </div>
          {account && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">EOA</span>
              <span className="font-mono text-xs">
                {account.address.slice(0, 10)}...{account.address.slice(-8)}
              </span>
            </div>
          )}
          {smartAccount.address && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smart Account</span>
              <span className="font-mono text-xs">
                {smartAccount.address.slice(0, 10)}...
                {smartAccount.address.slice(-8)}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
