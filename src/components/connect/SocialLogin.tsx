"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "@/hooks/useConnect";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { getConnectorIcon, EmailIcon } from "./WalletIcons";

const PRIMARY_COUNT = 6;

export function SocialLogin() {
  const { connect, socialConnectors, hasSocialLogin, connectWithEmail, isPending } = useConnect();
  const { isConnecting } = useAccount();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showAll, setShowAll] = useState(false);

  const loading = isPending || isConnecting;

  if (!hasSocialLogin) {
    return (
      <div className="text-center py-6 space-y-2">
        <p className="text-muted-foreground text-sm">
          Social login requires Web3Auth configuration.
        </p>
        <p className="text-xs text-muted-foreground">
          Set{" "}
          <code className="bg-muted px-1 rounded">
            NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
          </code>{" "}
          in your .env
        </p>
      </div>
    );
  }

  const handleSocialConnect = (connectorId: string) => {
    const connector = socialConnectors.find((c) => c.id === connectorId);
    if (!connector) return;
    setConnectingId(connectorId);
    connect(
      { connector },
      { onSettled: () => setConnectingId(null) }
    );
  };

  const handleEmailConnect = () => {
    if (!email.trim()) return;
    setConnectingId("web3auth-email");
    connectWithEmail(email, {
      onSettled: () => setConnectingId(null),
    });
  };

  const visibleConnectors = showAll
    ? socialConnectors
    : socialConnectors.slice(0, PRIMARY_COUNT);
  const hasMore = socialConnectors.length > PRIMARY_COUNT;

  return (
    <div className="space-y-4">
      {socialConnectors.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {visibleConnectors.map((connector) => {
              const Icon = getConnectorIcon(connector.id);
              const isThis = connectingId === connector.id;
              return (
                <button
                  key={connector.uid}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSocialConnect(connector.id)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-2.5 transition-colors hover:bg-accent hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={connector.name}
                >
                  {isThis ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Icon size={20} />
                  )}
                  <span className="text-[10px] text-muted-foreground leading-none truncate w-full text-center">
                    {connector.name}
                  </span>
                </button>
              );
            })}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-center gap-1 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <span>{showAll ? "Show less" : `+${socialConnectors.length - PRIMARY_COUNT} more`}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <EmailIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEmailConnect();
              }}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            size="default"
            disabled={loading || !email.trim()}
            onClick={handleEmailConnect}
            className="shrink-0"
          >
            {connectingId === "web3auth-email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Go"
            )}
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Keys are secured with MPC — no single party holds your full private key.
      </p>
    </div>
  );
}
