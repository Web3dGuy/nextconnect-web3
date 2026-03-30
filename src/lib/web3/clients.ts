import { createPublicClient, http, type Chain } from "viem";
import { defaultChain } from "./chains";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export const publicClient = createPublicClient({
  chain: defaultChain,
  transport: http(rpcUrl),
});

export function createPublicClientForChain(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}
