import { NextResponse } from "next/server";
import { generateNonce } from "@/lib/auth/nonce.server";
import { storeNonce } from "@/lib/auth/nonce-store";

export async function GET() {
  const nonce = generateNonce();
  storeNonce(nonce);
  return NextResponse.json({ nonce });
}
