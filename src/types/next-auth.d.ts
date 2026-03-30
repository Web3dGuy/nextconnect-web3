import "next-auth";

declare module "next-auth" {
  interface Session {
    address?: string;
    chainId?: number;
  }

  interface User {
    address?: string;
    chainId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address?: string;
    chainId?: number;
  }
}
