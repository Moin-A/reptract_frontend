import { NextResponse } from "next/server";
import { ReptrackApi } from "../../../../../service/api";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const api = new ReptrackApi();

  const upstream = await api.request("/users/sign_in", {
    method: "POST",
    body: JSON.stringify({ user: { email, password } }),
  });

  const body = await upstream.text();
  const res = new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });

  // Forward Rails' session Set-Cookie(s) to the browser. getSetCookie() returns
  // each Set-Cookie separately (a plain .get folds them into one, corrupting
  // values whose Expires date contains a comma).
  for (const cookie of upstream.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }

  // Store the tenant subdomain (workspace.subdomain, e.g. "ironworks") so
  // ReptrackApi routes later requests to <subdomain>.<api-host>; Apartment maps
  // that subdomain to the workspace's schema. Only when the user has a workspace.
  if (upstream.ok) {
    try {
      const ws = JSON.parse(body)?.user?.workspace;
      const subdomain = ws?.subdomain ?? ws?.name;
      if (subdomain) {
        // Append as a raw Set-Cookie, same path as the session cookies above —
        // mixing res.cookies.set() with res.headers.append() drops one of them.
        const attrs = [`subdomain=${encodeURIComponent(subdomain)}`, "Path=/", "HttpOnly", "SameSite=Lax"];
        if (process.env.NODE_ENV === "production") attrs.push("Secure");
        res.headers.append("set-cookie", attrs.join("; "));
      }
    } catch {
      // Non-JSON body (e.g. an error) — nothing to persist.
    }
  }

  return res;
}
