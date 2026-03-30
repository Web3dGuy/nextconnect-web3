# NextConnect

Open-source Next.js web3 template with embedded wallets, smart accounts, and full auth — no vendor lock-in.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **viem** + **wagmi** — type-safe Ethereum client & React hooks
- **Web3Auth** — social login → embedded wallet (MPC, non-custodial)
- **permissionless.js** — ERC-4337 smart accounts, bundler, paymaster
- **NextAuth** + **SIWE** — server-verified sessions with Sign-In with Ethereum
- **shadcn/ui** + **Tailwind CSS** — beautiful, themeable components

## Features

- External wallet connection (MetaMask, WalletConnect, Coinbase)
- Web3Auth social login / email (MPC key management, non-custodial)
- ConnectButton with modal, wallet selector, account details panel
- Wallet dashboard with tokens, NFTs, transaction history
- Send / receive with token search and selection
- Network selector (14 chains — mainnets and testnets)
- Private key export for embedded wallets
- NextAuth sessions with SIWE (Sign-In with Ethereum)
- Admin dashboard with wallet-based access gating
- Server-side admin route protection via middleware
- 8 built-in themes (Gruvbox, Nord, Everforest, Catppuccin — light & dark)
- ERC-4337 smart account support via permissionless.js

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Web3dGuy/nextconnect-web3.git && cd nextconnect-web3

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
| `NEXT_PUBLIC_BUNDLER_URL` | For smart accounts | [Pimlico](https://dashboard.pimlico.io) (free tier) |
| `NEXT_PUBLIC_PAYMASTER_URL` | For gas sponsorship | Same as bundler provider |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | For smart accounts | Deploy your own or use default |

See `.env.example` for full details with links to each service.

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
│   │   ├── ConnectButton          # Main connect/wallet button
│   │   ├── ConnectModal           # Wallet selection + social login
│   │   ├── WalletOptions          # MetaMask, WalletConnect, Coinbase
│   │   ├── SocialLogin            # Web3Auth email/social
│   │   └── AccountDetails         # Connected account panel
│   ├── wallet/
│   │   ├── WalletDashboard        # Tabbed wallet management UI
│   │   ├── NetworkSelector        # Chain switcher (14 networks)
│   │   ├── TokenList              # ERC20 token balances
│   │   ├── NFTGallery             # NFT viewer
│   │   ├── TransactionList        # Transaction history
│   │   ├── SendModal              # Send tokens
│   │   ├── ReceiveModal           # Receive with QR code
│   │   └── WalletSettings         # Key export, linked accounts
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
│   ├── tokens/                    # ERC20/ERC721 helpers, default token lists
│   ├── transactions/              # Transaction history store
│   └── auth/                      # NextAuth config, SIWE helpers
│
└── middleware.ts                   # Protects /admin with NextAuth
```

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
