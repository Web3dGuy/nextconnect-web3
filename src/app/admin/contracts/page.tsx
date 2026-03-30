"use client";

import { FACTORY_ADDRESS, ENTRYPOINT_ADDRESS_V07, BUNDLER_URL, PAYMASTER_URL } from "@/lib/web3/constants";
import { defaultChain } from "@/lib/web3/chains";
import { FileText, ExternalLink } from "lucide-react";

const DEFAULT_FACTORY_V07 = "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";

type ContractInfo = {
  label: string;
  address: string;
  description: string;
};

export default function ContractsPage() {
  const explorerBase = defaultChain.blockExplorers?.default.url;

  const factoryAddr = FACTORY_ADDRESS ?? DEFAULT_FACTORY_V07;

  const contracts: ContractInfo[] = [
    {
      label: "Account Factory (SimpleAccountFactory)",
      address: factoryAddr,
      description: FACTORY_ADDRESS
        ? "Custom factory set via NEXT_PUBLIC_FACTORY_ADDRESS."
        : "Canonical pre-deployed SimpleAccountFactory for EntryPoint v0.7 (by Pimlico). No deployment needed.",
    },
    {
      label: "EntryPoint v0.7",
      address: ENTRYPOINT_ADDRESS_V07,
      description:
        "Canonical ERC-4337 EntryPoint contract. Handles UserOperation validation and execution.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Contracts</h1>

      <div className="space-y-4">
        {contracts.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">{c.label}</h3>
              </div>
              {explorerBase && (
                <a
                  href={`${explorerBase}/address/${c.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <code className="text-xs font-mono block bg-background rounded px-2 py-1 border border-border break-all">
              {c.address}
            </code>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>

      {/* Infrastructure */}
      <h2 className="text-lg font-semibold pt-4">Infrastructure</h2>
      <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Network</span>
          <span>
            {defaultChain.name} (ID: {defaultChain.id})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bundler</span>
          <span className={BUNDLER_URL ? "text-success" : "text-warning"}>
            {BUNDLER_URL ? "Configured" : "Not set"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Paymaster</span>
          <span
            className={PAYMASTER_URL ? "text-success" : "text-warning"}
          >
            {PAYMASTER_URL ? "Configured" : "Not set"}
          </span>
        </div>
      </div>
    </div>
  );
}
