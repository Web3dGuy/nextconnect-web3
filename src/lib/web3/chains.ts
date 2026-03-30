import { defineChain } from "viem";
import {
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
} from "viem/chains";

export const supportedChains = [
  polygon,
  polygonAmoy,
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
] as const;

export type SupportedChain = (typeof supportedChains)[number];
export type SupportedChainId = SupportedChain["id"];

export const CHAIN_GROUPS = [
  { label: "Ethereum", chains: [mainnet, sepolia] },
  { label: "Polygon", chains: [polygon, polygonAmoy] },
  { label: "Arbitrum", chains: [arbitrum, arbitrumSepolia] },
  { label: "Optimism", chains: [optimism, optimismSepolia] },
  { label: "Base", chains: [base, baseSepolia] },
  { label: "BNB Chain", chains: [bsc, bscTestnet] },
  { label: "Avalanche", chains: [avalanche, avalancheFuji] },
] as const;

const TESTNET_IDS = new Set<number>([
  sepolia.id,
  polygonAmoy.id,
  arbitrumSepolia.id,
  optimismSepolia.id,
  baseSepolia.id,
  bscTestnet.id,
  avalancheFuji.id,
]);

export function isTestnet(chainId: number): boolean {
  return TESTNET_IDS.has(chainId);
}

export function getChainById(chainId: number) {
  return supportedChains.find((c) => c.id === chainId);
}

export const defaultChain = (() => {
  const envId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  return getChainById(envId) ?? polygonAmoy;
})();

export {
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
  defineChain,
};
