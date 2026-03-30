"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { ConnectModal } from "./ConnectModal";
import { shortenAddress } from "@/lib/utils";
import { Wallet, ChevronDown } from "lucide-react";

function Blockie({ address, size = 24 }: { address: string; size?: number }) {
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

type ConnectButtonProps = {
  appName?: string;
  className?: string;
};

export function ConnectButton({
  appName = "NextConnect",
  className,
}: ConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {isConnected && address ? (
        <Button
          variant="secondary"
          className={className}
          onClick={() => setModalOpen(true)}
        >
          <Blockie address={address} size={20} />
          <span className="font-mono text-xs">
            {shortenAddress(address)}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      ) : (
        <Button className={className} onClick={() => setModalOpen(true)}>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      )}

      <ConnectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        appName={appName}
      />
    </>
  );
}
