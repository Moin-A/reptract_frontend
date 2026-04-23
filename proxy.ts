import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  console.log("Proxy executed:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
