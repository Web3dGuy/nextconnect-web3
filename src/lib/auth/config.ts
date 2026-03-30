import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifySiweMessage } from "./siwe";
import { consumeNonce } from "./nonce-store";

if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[NextConnect] NEXTAUTH_SECRET is required in production. Sessions would be insecure without it."
    );
  }
  console.warn(
    "[NextConnect] NEXTAUTH_SECRET is not set. Sessions will be insecure."
  );
}

function getExpectedDomain(): string | undefined {
  const url = process.env.NEXTAUTH_URL;
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "siwe",
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) {
          console.warn("[NextConnect/auth] Missing SIWE credentials");
          return null;
        }

        try {
          const result = await verifySiweMessage(
            credentials.message,
            credentials.signature,
            getExpectedDomain()
          );

          if (!result.success) {
            console.warn("[NextConnect/auth] SIWE verification failed:", result.error);
            return null;
          }

          const { address, nonce, chainId } = result.data;

          if (!consumeNonce(nonce)) {
            console.warn(
              "[NextConnect/auth] Invalid or expired nonce — possible replay attack"
            );
            return null;
          }

          return {
            id: address,
            name: address,
            address,
            chainId,
          };
        } catch (err) {
          console.error("[NextConnect/auth] SIWE error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = (user as { address?: string }).address;
        token.chainId = (user as { chainId?: number }).chainId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { address?: string }).address = token.address as string;
      (session as { chainId?: number }).chainId = token.chainId as number;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
