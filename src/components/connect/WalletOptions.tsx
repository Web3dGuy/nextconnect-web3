"use client";

import { useState } from "react";
import { useConnect } from "@/hooks/useConnect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getConnectorIcon } from "./WalletIcons";

export function WalletOptions() {
  const { connect, walletConnectors, isPending } = useConnect();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  if (walletConnectors.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No wallets detected. Install MetaMask or another wallet extension.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {walletConnectors.map((connector) => {
        const Icon = getConnectorIcon(connector.id);
        const isThis = connectingId === connector.id;
        return (
          <Button
            key={connector.uid}
            variant="outline"
            className="w-full justify-start gap-3 h-12 px-4"
            disabled={isPending}
            onClick={() => {
              setConnectingId(connector.id);
              connect(
                { connector },
                { onSettled: () => setConnectingId(null) }
              );
            }}
          >
            {isThis ? (
              <Loader2 className="h-5 w-5 animate-spin shrink-0" />
            ) : (
              <span className="shrink-0">
                <Icon size={22} />
              </span>
            )}
            <span className="text-sm">{connector.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
