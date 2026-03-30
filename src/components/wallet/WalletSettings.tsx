"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { getWeb3Auth } from "@/lib/web3/web3auth";
import { getConnectorIcon } from "@/components/connect/WalletIcons";
import { NetworkSelector } from "./NetworkSelector";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import {
  LogOut,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  User,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";

function ExportPrivateKey() {
  const [step, setStep] = useState<"idle" | "confirm" | "revealed">("idle");
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "revealed" || !privateKey) return;
    const timeout = setTimeout(() => {
      setPrivateKey(null);
      setStep("idle");
    }, 30_000);
    return () => clearTimeout(timeout);
  }, [step, privateKey]);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const web3auth = getWeb3Auth();
      if (!web3auth.provider) throw new Error("Web3Auth provider not available");
      const key = await web3auth.provider.request({ method: "private_key" }) as string;
      if (!key || typeof key !== "string") throw new Error("Failed to retrieve private key");
      setPrivateKey(key);
      setStep("revealed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export key");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!privateKey) return;
    await copyToClipboard(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Private key copied — clear your clipboard soon!");
  };

  if (step === "idle") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 text-xs"
        onClick={() => setStep("confirm")}
      >
        <Key className="h-3.5 w-3.5" />
        Export Private Key
      </Button>
    );
  }

  if (step === "confirm") {
    return (
      <div className="rounded-lg border border-warning/50 bg-warning/5 p-3 space-y-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-medium text-foreground">Security Warning</p>
            <p className="text-muted-foreground">
              Your private key gives full control of your wallet. Never share it.
              It will auto-clear after 30 seconds.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "I understand, reveal key"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setStep("idle")}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-[11px] text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Private Key</span>
        <span className="text-[10px] text-warning">Auto-clears in 30s</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-background px-2 py-1.5 border border-border">
        <code className="text-[11px] font-mono flex-1 break-all select-all blur-sm hover:blur-none transition-all">
          {privateKey}
        </code>
        <button onClick={handleCopy} className="shrink-0 text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs"
        onClick={() => {
          setPrivateKey(null);
          setStep("idle");
        }}
      >
        Clear & Close
      </Button>
    </div>
  );
}

function LinkedAccounts() {
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const web3auth = getWeb3Auth();
        if (web3auth.connected) {
          const info = await web3auth.getUserInfo();
          setUserInfo(info as Record<string, unknown>);
        }
      } catch {
        // Not a Web3Auth session
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading account info...
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        Linked Account
      </div>
      <div className="space-y-1 text-xs">
        {userInfo.name ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{`${userInfo.name}`}</span>
          </div>
        ) : null}
        {userInfo.email ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{`${userInfo.email}`}</span>
          </div>
        ) : null}
        {userInfo.typeOfLogin ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider</span>
            <span className="capitalize">{`${userInfo.typeOfLogin}`}</span>
          </div>
        ) : null}
        {userInfo.profileImage ? (
          <div className="flex justify-center pt-1">
            <img
              src={`${userInfo.profileImage}`}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function WalletSettings() {
  const { connector } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { isAuthenticated, signOut } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);

  const isWeb3Auth = connector?.id.startsWith("web3auth-") ?? false;
  const ConnectorIcon = connector ? getConnectorIcon(connector.id) : null;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      if (isAuthenticated) await signOut();
      await disconnectAsync();
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connected Provider */}
      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center gap-3">
          {ConnectorIcon && (
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-accent">
              <ConnectorIcon size={18} />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{connector?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">Connected provider</p>
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Network</label>
        <NetworkSelector />
      </div>

      {/* Linked Accounts (Web3Auth only) */}
      {isWeb3Auth && <LinkedAccounts />}

      {/* Export Key (Web3Auth only) */}
      {isWeb3Auth && <ExportPrivateKey />}

      {/* Auth Status */}
      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Session:</span>
          {isAuthenticated ? (
            <span className="text-success">Verified (SIWE)</span>
          ) : (
            <span className="text-warning">Not verified</span>
          )}
        </div>
      </div>

      {/* Disconnect */}
      <Button
        variant="ghost"
        className="w-full gap-2 text-destructive hover:text-destructive"
        onClick={handleDisconnect}
        disabled={disconnecting}
      >
        {disconnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {disconnecting ? "Disconnecting..." : "Disconnect Wallet"}
      </Button>
    </div>
  );
}
