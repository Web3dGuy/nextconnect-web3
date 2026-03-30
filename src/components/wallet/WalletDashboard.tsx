"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useAuth } from "@/hooks/useAuth";
import { getChainById, isTestnet } from "@/lib/web3/chains";
import { shortenAddress, copyToClipboard } from "@/lib/utils";
import { NetworkSelector } from "./NetworkSelector";
import { TokenList } from "./TokenList";
import { NFTGallery } from "./NFTGallery";
import { TransactionList } from "./TransactionList";
import { WalletSettings } from "./WalletSettings";
import { SendModal } from "./SendModal";
import { ReceiveModal } from "./ReceiveModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Coins,
  Image,
  Clock,
  Settings,
  Send,
  QrCode,
  Copy,
  Check,
  Shield,
  Loader2,
  Fingerprint,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

function Blockie({ address, size = 32 }: { address: string; size?: number }) {
  const colors = useMemo(() => {
    const seed = parseInt(address.slice(2, 10), 16);
    const h = seed % 360;
    return {
      bg: `hsl(${h}, 65%, 55%)`,
      fg: `hsl(${(h + 140) % 360}, 50%, 70%)`,
    };
  }, [address]);

  return (
    <div
      aria-hidden="true"
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.fg})`,
      }}
    />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label="Copy address"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function UnsupportedNetworkBanner() {
  const { chainId } = useAccount();
  const isSupported = chainId ? !!getChainById(chainId) : true;
  if (isSupported) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-xs">
      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
      <span className="flex-1">Unsupported network (ID: {chainId})</span>
    </div>
  );
}

function OverviewTab() {
  const account = useActiveAccount();
  const smartAccount = useSmartAccount();
  const { isAuthenticated, isSigningIn, error: authError, signInWithEthereum, isAdmin } = useAuth();
  const { chainId } = useAccount();
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  if (!account) return null;

  const chain = chainId ? getChainById(chainId) : undefined;
  const explorerUrl = chain?.blockExplorers?.default.url;
  const nativeSymbol = chain?.nativeCurrency.symbol ?? "ETH";

  return (
    <div className="space-y-4">
      <UnsupportedNetworkBanner />

      {/* Main Address Card */}
      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Blockie address={account.address} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">{shortenAddress(account.address)}</code>
              <CopyButton text={account.address} />
              {explorerUrl && (
                <a
                  href={`${explorerUrl}/address/${account.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <NetworkSelector />
              {chain && isTestnet(chain.id) && (
                <span className="text-[9px] px-1 py-0.5 rounded bg-warning/15 text-warning font-medium">
                  testnet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="text-center py-2">
          <p className="text-2xl font-bold font-mono tabular-nums">
            {account.balanceFormatted
              ? Number(account.balanceFormatted).toFixed(4)
              : "0.0000"}
          </p>
          <p className="text-sm text-muted-foreground">{nativeSymbol}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setSendOpen(true)}>
            <Send className="h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setReceiveOpen(true)}>
            <QrCode className="h-4 w-4" />
            Receive
          </Button>
        </div>
      </div>

      {/* Smart Account */}
      {smartAccount.isEnabled && (
        <div className="rounded-lg border border-border p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Smart Account</span>
            {smartAccount.isLoading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
            {smartAccount.address && !smartAccount.isLoading && (
              <span className="ml-auto text-[10px] text-success">Active</span>
            )}
          </div>
          {smartAccount.address && (
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono">{shortenAddress(smartAccount.address)}</code>
              <CopyButton text={smartAccount.address} />
              {explorerUrl && (
                <a href={`${explorerUrl}/address/${smartAccount.address}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
          {smartAccount.error && (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <p className="text-xs truncate">{smartAccount.error.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Auth */}
      {!isAuthenticated ? (
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={signInWithEthereum}
            disabled={isSigningIn}
          >
            {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
            {isSigningIn ? "Signing..." : "Verify with Signature"}
          </Button>
          {authError && (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <p className="text-xs truncate">{authError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-success px-1">
          <Check className="h-3 w-3" />
          <span>Session verified</span>
          {isAdmin && (
            <span className="ml-auto bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
              ADMIN
            </span>
          )}
        </div>
      )}

      <SendModal open={sendOpen} onOpenChange={setSendOpen} />
      <ReceiveModal open={receiveOpen} onOpenChange={setReceiveOpen} />
    </div>
  );
}

export function WalletDashboard() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full grid grid-cols-5 h-9">
        <TabsTrigger value="overview" className="text-xs gap-1 px-1">
          <Wallet className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="tokens" className="text-xs gap-1 px-1">
          <Coins className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Tokens</span>
        </TabsTrigger>
        <TabsTrigger value="nfts" className="text-xs gap-1 px-1">
          <Image className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">NFTs</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="text-xs gap-1 px-1">
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-xs gap-1 px-1">
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="tokens" className="mt-0">
          <TokenList />
        </TabsContent>
        <TabsContent value="nfts" className="mt-0">
          <NFTGallery />
        </TabsContent>
        <TabsContent value="activity" className="mt-0">
          <TransactionList />
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          <WalletSettings />
        </TabsContent>
      </div>
    </Tabs>
  );
}
