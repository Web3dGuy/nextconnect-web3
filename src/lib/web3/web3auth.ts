import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { defaultChain } from "./chains";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "";

const web3AuthNetwork = (() => {
  const env = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK?.toLowerCase();
  if (env === "mainnet" || env === "sapphire_mainnet")
    return WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
  if (env === "testnet" || env === "sapphire_testnet")
    return WEB3AUTH_NETWORK.TESTNET;
  return WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
})();

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: `0x${defaultChain.id.toString(16)}`,
  rpcTarget:
    process.env.NEXT_PUBLIC_RPC_URL ??
    defaultChain.rpcUrls.default.http[0],
  displayName: defaultChain.name,
  tickerName: defaultChain.nativeCurrency.name,
  ticker: defaultChain.nativeCurrency.symbol,
  blockExplorerUrl: defaultChain.blockExplorers?.default.url ?? "",
};

let privateKeyProviderInstance: EthereumPrivateKeyProvider | null = null;

function getPrivateKeyProvider() {
  if (!privateKeyProviderInstance) {
    privateKeyProviderInstance = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });
  }
  return privateKeyProviderInstance;
}

let web3authInstance: Web3AuthNoModal | null = null;

export function getWeb3Auth(): Web3AuthNoModal {
  if (!web3authInstance) {
    if (!clientId) {
      throw new Error(
        "NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is required for social login"
      );
    }

    const instance = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork,
      privateKeyProvider: getPrivateKeyProvider(),
    });

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/`
        : undefined;

    const authAdapter = new AuthAdapter({
      adapterSettings: {
        uxMode: "redirect",
        ...(redirectUrl ? { redirectUrl } : {}),
      },
    });
    instance.configureAdapter(authAdapter);

    web3authInstance = instance;
  }
  return web3authInstance;
}

export { chainConfig };
