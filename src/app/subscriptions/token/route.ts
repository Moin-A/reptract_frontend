import { NextResponse } from "next/server";
import { ReptrackApi } from "../../../../service/api";
import { cookies } from "next/headers";

// Proxies GET /subscriptions/token to Rails. Rails authenticates via the
// session cookie and responds with a `push_token` Set-Cookie, which we forward
// to the browser (same pattern as the subdomain cookie in users/sign_in).
export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi({ public: true });

  const upstream = await api.request("/subscriptions/token", {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  const body = await upstream.text();
  const res = new NextResponse(body || null, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });

  // Forward Rails' Set-Cookie(s) — including push_token — to the browser.
  for (const cookie of upstream.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }

  return res;
}
