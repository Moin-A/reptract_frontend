import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerUser } from "../service/api";
import { Session } from "inspector/promises";


const PUBLIC_PATHS = ["/"];

// Billing/checkout lives on the Rails backend (a different origin), so this is
// an absolute URL we redirect the browser to when a user has no workspace yet.
const BILLING_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_BILLING_CHECKOUT_URL ?? "http://localhost:3000/billing/checkout";

export async function proxy(request: NextRequest) {
  
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
      const initialUser = await getServerUser();
      if (!initialUser) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (!initialUser.workspace) {
        const workspace = request.cookies.get("workspace")?.value;
        return NextResponse.redirect(new URL(BILLING_CHECKOUT_URL));
      }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};