# NextConnect

Open-source Next.js web3 template with embedded wallets, smart accounts, and full auth — no thirdweb dependency, no vendor lock-in.

## What This Replaces

This template provides the same functionality as thirdweb's SDK using only open-source libraries:

| Feature | Thirdweb | NextConnect |
|---------|----------|-------------|
| Wallet connection | `ConnectButton` | `<ConnectButton />` (wagmi + custom UI) |
| Embedded wallets | `inAppWallet()` | Web3Auth (MPC key management) |
| Smart accounts | `smartAccount` config | permissionless.js (ERC-4337) |
| Gas sponsorship | `sponsorGas: true` | Configurable paymaster |
| Auth sessions | `ThirdwebProvider` | NextAuth + SIWE |
| React hooks | `useActiveAccount` | `useActiveAccount` (drop-in) |
| Theming | `darkTheme`/`lightTheme` | CSS variables (8 themes) |

## Stack

- **Next.js 15** (App Router) + **React 19**
- **viem** + **wagmi** — type-safe Ethereum client & React hooks
- **Web3Auth** — social login → embedded wallet (MPC, non-custodial)
- **permissionless.js** — ERC-4337 smart accounts, bundler, paymaster
- **NextAuth** + **SIWE** — server-verified sessions with Sign-In with Ethereum
- **shadcn/ui** + **Tailwind CSS** — beautiful, themeable components

## Quick Start

```bash
# 1. Clone
git clone <repo-url> && cd nextconnect

# 2. Copy env and fill in your keys
cp .env.example .env.local

# 3. Install
npm install --legacy-peer-deps

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | For social login | [Web3Auth Dashboard](https://dashboard.web3auth.io) (free) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | For WalletConnect | [WalletConnect Cloud](https://cloud.walletconnect.com) (free) |
| `NEXTAUTH_SECRET` | Yes | Any random string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_BUNDLER_URL` | For smart accounts | [Pimlico](https://pimlico.io) (free tier) or self-host [Alto](https://github.com/pimlicolabs/alto) |
| `NEXT_PUBLIC_PAYMASTER_URL` | For gas sponsorship | Same as bundler provider |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | For smart accounts | Deploy your own or use default |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with NextConnectProvider
│   ├── page.tsx                   # Home page with ConnectButton
│   ├── api/auth/                  # NextAuth + nonce endpoints
│   └── admin/                     # Admin pages with wallet gating
│
├── components/
│   ├── providers/
│   │   └── NextConnectProvider    # Wagmi + QueryClient + NextAuth + Theme
│   ├── connect/
│   │   ├── ConnectButton          # Drop-in thirdweb replacement
│   │   ├── ConnectModal           # Wallet selection + social login
│   │   ├── WalletOptions          # MetaMask, WalletConnect, Coinbase
│   │   ├── SocialLogin            # Web3Auth email/social
│   │   └── AccountDetails         # Connected account panel
│   ├── theme/                     # Theme provider + switcher
│   └── ui/                        # shadcn/ui primitives
│
├── hooks/
│   ├── useActiveAccount           # Wallet address, balance, chain
│   ├── useConnect                 # Connect/disconnect wallet
│   ├── useAuth                    # SIWE sign-in, session, admin check
│   ├── useSmartAccount            # ERC-4337 smart account state
│   └── useTheme                   # Theme context
│
├── lib/
│   ├── web3/                      # Wagmi config, viem clients, Web3Auth, chains
│   ├── smart-account/             # permissionless.js client, bundler, paymaster
│   └── auth/                      # NextAuth config, SIWE helpers
│
└── middleware.ts                   # Protects /admin with NextAuth
```

## Migrating from Thirdweb (cohorde/web)

Only 4 files need modification, 2 files deleted:

### 1. Replace `src/app/client.ts`
Delete this file. The viem/wagmi config in `lib/web3/config.ts` replaces it.

### 2. Update `src/app/layout.tsx`
```diff
- import { ThirdwebProvider } from "thirdweb/react";
+ import { NextConnectProvider } from "@/components/providers/NextConnectProvider";

- <ThirdwebProvider>
+ <NextConnectProvider>
    {children}
- </ThirdwebProvider>
+ </NextConnectProvider>
```

### 3. Update pages using ConnectButton
```diff
- import { ConnectButton, useActiveAccount } from "thirdweb/react";
- import { polygonAmoy } from "thirdweb/chains";
- import { inAppWallet } from "thirdweb/wallets";
- import { client } from "./client";
+ import { ConnectButton } from "@/components/connect/ConnectButton";
+ import { useActiveAccount } from "@/hooks/useActiveAccount";

// Remove wallet config array — handled by provider
- const wallets = [inAppWallet({ smartAccount: { ... } })];

// Replace ConnectButton usage
- <ConnectButton client={client} wallets={wallets} theme={twTheme} ... />
+ <ConnectButton appName="CoHorde" />

// useActiveAccount returns { address, isConnected, ... } instead of Account object
- account.address
+ account.address  // same!
```

### 4. Delete `src/lib/thirdweb-theme.ts`
Theming is now CSS variable-based. No JS theme object needed.

### 5. Update `package.json`
```diff
- "thirdweb": "^5"
+ "viem": "^2",
+ "wagmi": "^2",
+ "@tanstack/react-query": "^5",
+ "@web3auth/modal": "^9",
+ "@web3auth/ethereum-provider": "^9",
+ "@web3auth/base": "^9",
+ "@web3auth/web3auth-wagmi-connector": "^7",
+ "permissionless": "^0.2",
+ "next-auth": "^4",
+ "siwe": "^2"
```

## Features

### Working Now
- External wallet connection (MetaMask, WalletConnect, Coinbase)
- Web3Auth social login / email (with NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)
- ConnectButton with modal, wallet selector, account details panel
- NextAuth sessions with SIWE (Sign-In with Ethereum)
- Server-side admin route protection via middleware
- Client-side admin wallet gating
- 8 built-in themes (Gruvbox, Nord, Everforest, Catppuccin — light & dark)
- Smart account initialization via permissionless.js

### With Configuration
- ERC-4337 smart account transactions (needs bundler URL)
- Gas sponsorship (needs paymaster URL)
- Account factory deployment (Foundry contracts in `/contracts`)

## Cost

| Component | Cost |
|-----------|------|
| wagmi + viem | Free (MIT) |
| Web3Auth | Free tier: 1,000 MAU |
| Pimlico bundler | Free tier available |
| NextAuth | Free (self-hosted) |
| **Total at low scale** | **$0/mo** |

## License

MIT
