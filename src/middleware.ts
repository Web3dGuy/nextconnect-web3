import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) return NextResponse.next();

  if (!token || !token.address) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!ADMIN_WALLET || ADMIN_WALLET.length === 0) {
    return new NextResponse("Forbidden — no admin wallet configured", {
      status: 403,
    });
  }

  if ((token.address as string).toLowerCase() !== ADMIN_WALLET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
