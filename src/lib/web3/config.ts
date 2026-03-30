import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { defaultChain, supportedChains } from "./chains";
import { getWeb3Auth } from "./web3auth";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const SOCIAL_PROVIDERS = [
  { id: "web3auth-google", name: "Google", loginProvider: "google" },
  { id: "web3auth-apple", name: "Apple", loginProvider: "apple" },
  { id: "web3auth-discord", name: "Discord", loginProvider: "discord" },
  { id: "web3auth-github", name: "GitHub", loginProvider: "github" },
  { id: "web3auth-twitter", name: "X (Twitter)", loginProvider: "twitter" },
  { id: "web3auth-linkedin", name: "LinkedIn", loginProvider: "linkedin" },
  { id: "web3auth-facebook", name: "Facebook", loginProvider: "facebook" },
  { id: "web3auth-reddit", name: "Reddit", loginProvider: "reddit" },
  { id: "web3auth-twitch", name: "Twitch", loginProvider: "twitch" },
  { id: "web3auth-farcaster", name: "Farcaster", loginProvider: "farcaster" },
  { id: "web3auth-line", name: "Line", loginProvider: "line" },
  { id: "web3auth-kakao", name: "Kakao", loginProvider: "kakao" },
] as const;

export const EMAIL_PROVIDER = {
  id: "web3auth-email",
  name: "Email",
  loginProvider: "email_passwordless",
} as const;

function buildConnectors() {
  const connectors = [
    injected(),
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId })]
      : []),
    coinbaseWallet({ appName: "NextConnect" }),
  ];

  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
    try {
      const web3auth = getWeb3Auth();

      for (const provider of SOCIAL_PROVIDERS) {
        connectors.push(
          Web3AuthConnector({
            web3AuthInstance: web3auth,
            loginParams: { loginProvider: provider.loginProvider },
            id: provider.id,
            name: provider.name,
          }) as ReturnType<typeof injected>
        );
      }
    } catch {
      // Web3Auth init can fail in SSR — silently skip
    }
  }

  return connectors;
}

export function createWagmiConfig() {
  return createConfig({
    chains: supportedChains,
    connectors: buildConnectors(),
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    transports: Object.fromEntries(
      supportedChains.map((chain) => [
        chain.id,
        http(
          chain.id === defaultChain.id
            ? process.env.NEXT_PUBLIC_RPC_URL
            : undefined
        ),
      ])
    ) as Record<(typeof supportedChains)[number]["id"], ReturnType<typeof http>>,
  });
}

export type AppWagmiConfig = ReturnType<typeof createWagmiConfig>;
