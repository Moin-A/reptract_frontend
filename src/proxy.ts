import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerUser } from "../service/api";


const PUBLIC_PATHS = ["/"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  console.log("called")
  try {
      const initialUser = await getServerUser();
      if (!initialUser) {
        return NextResponse.redirect(new URL("/", request.url));
      }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};