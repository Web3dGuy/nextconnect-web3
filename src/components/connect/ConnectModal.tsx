"use client";

import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SocialLogin } from "./SocialLogin";
import { WalletOptions } from "./WalletOptions";
import { WalletDashboard } from "@/components/wallet/WalletDashboard";

type ConnectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName?: string;
};

export function ConnectModal({
  open,
  onOpenChange,
  appName = "NextConnect",
}: ConnectModalProps) {
  const { isConnected } = useAccount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`gap-0 p-0 ${
          isConnected
            ? "sm:max-w-[480px] overflow-visible"
            : "sm:max-w-[420px] overflow-hidden"
        }`}
        onPointerDownOutside={(e) => {
          if (isConnected) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isConnected) e.preventDefault();
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {isConnected ? "Wallet" : `Connect to ${appName}`}
          </DialogTitle>
          <DialogDescription className={isConnected ? "sr-only" : undefined}>
            {isConnected
              ? "Manage your connected wallet"
              : "Choose how you\u0027d like to connect"}
          </DialogDescription>
        </DialogHeader>

        {isConnected ? (
          <div className="px-6 pb-6 pt-2">
            <WalletDashboard />
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-4">
            <SocialLogin />

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or use a wallet
              </span>
            </div>

            <WalletOptions />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
