"use client";

import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { createWagmiConfig } from "@/lib/web3/config";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const wagmiConfig = createWagmiConfig();

export function NextConnectProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
