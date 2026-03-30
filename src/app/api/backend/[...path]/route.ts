import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8080";

async function proxyRequest(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.address) {
    return NextResponse.json(
      { error: "Unauthorized — sign in with your wallet first" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const backendPath = url.pathname.replace(/^\/api\/backend/, "");
  const target = `${API_URL}${backendPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("x-wallet-address", token.address as string);
  headers.delete("host");

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: upstream.headers,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
