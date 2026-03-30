import { SiweMessage } from "siwe";

export function createSiweMessage({
  address,
  chainId,
  nonce,
  domain,
  uri,
  statement = "Sign in to NextConnect",
}: {
  address: string;
  chainId: number;
  nonce: string;
  domain?: string;
  uri?: string;
  statement?: string;
}) {
  const d =
    domain ??
    (typeof window !== "undefined" ? window.location.host : "localhost");
  const u =
    uri ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  return new SiweMessage({
    domain: d,
    address,
    statement,
    uri: u,
    version: "1",
    chainId,
    nonce,
  });
}

export async function verifySiweMessage(
  message: string,
  signature: string,
  expectedDomain?: string
) {
  const siweMessage = new SiweMessage(message);

  const verifyParams: { signature: string; domain?: string } = { signature };
  if (expectedDomain) {
    verifyParams.domain = expectedDomain;
  }

  const result = await siweMessage.verify(verifyParams);
  return result;
}
