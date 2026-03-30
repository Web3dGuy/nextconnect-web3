import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { http, type Chain, type WalletClient, type Account, type LocalAccount } from "viem";
import { toAccount } from "viem/accounts";
import { defaultChain } from "../web3/chains";
import {
  FACTORY_ADDRESS,
  BUNDLER_URL,
  PAYMASTER_URL,
  ENTRYPOINT_ADDRESS_V07,
} from "../web3/constants";
import { publicClient, createPublicClientForChain } from "../web3/clients";

export type SmartAccountConfig = {
  signer: WalletClient;
  factoryAddress?: `0x${string}`;
  chain?: Chain;
  sponsorGas?: boolean;
};

function walletClientToLocalAccount(
  walletClient: WalletClient
): LocalAccount {
  const account = walletClient.account;
  if (!account) throw new Error("Wallet client has no account");

  return toAccount({
    address: account.address,
    async signMessage({ message }) {
      return walletClient.signMessage({
        account: account as Account,
        message,
      });
    },
    async signTypedData(typedData) {
      return walletClient.signTypedData({
        account: account as Account,
        ...typedData,
      } as Parameters<typeof walletClient.signTypedData>[0]);
    },
    async signTransaction() {
      throw new Error("Smart accounts don't sign raw transactions");
    },
  });
}

async function pimlicoSponsor(params: {
  sender: `0x${string}`;
  nonce: bigint;
  callData: `0x${string}`;
  [key: string]: unknown;
}) {
  if (!PAYMASTER_URL) {
    throw new Error("NEXT_PUBLIC_PAYMASTER_URL is required for gas sponsorship");
  }

  const response = await fetch(PAYMASTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "pm_sponsorUserOperation",
      params: [params, ENTRYPOINT_ADDRESS_V07],
    }),
  });

  if (!response.ok) {
    throw new Error(`Paymaster HTTP error: ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(
      `Paymaster RPC error: ${json.error.message ?? JSON.stringify(json.error)}`
    );
  }

  return json.result;
}

export async function createNextConnectSmartAccount({
  signer,
  factoryAddress,
  chain,
  sponsorGas = true,
}: SmartAccountConfig) {
  if (!BUNDLER_URL) {
    throw new Error(
      "NEXT_PUBLIC_BUNDLER_URL is required for smart accounts"
    );
  }

  if (!signer.account) {
    throw new Error("Wallet client has no account");
  }

  const owner = walletClientToLocalAccount(signer);
  const targetChain = chain ?? defaultChain;
  const client =
    targetChain.id === defaultChain.id
      ? publicClient
      : createPublicClientForChain(targetChain);

  const account = await toSimpleSmartAccount({
    client,
    owner,
    ...(factoryAddress ? { factoryAddress } : {}),
    entryPoint: {
      address: ENTRYPOINT_ADDRESS_V07,
      version: "0.7",
    },
  });

  const shouldSponsor = sponsorGas && Boolean(PAYMASTER_URL);

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: targetChain,
    bundlerTransport: http(BUNDLER_URL),
    ...(shouldSponsor
      ? {
          paymaster: {
            async getPaymasterData(parameters: {
              sender: `0x${string}`;
              nonce: bigint;
              callData: `0x${string}`;
              [key: string]: unknown;
            }) {
              return pimlicoSponsor(parameters);
            },
          },
        }
      : {}),
  });

  return {
    account,
    client: smartAccountClient,
    address: account.address,
  };
}
