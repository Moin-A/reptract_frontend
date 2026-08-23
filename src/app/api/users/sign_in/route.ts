import { NextResponse } from "next/server";
import { ReptrackApi } from "../../../../../service/api";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const api = new ReptrackApi({ public: true });

  const upstream = await api.request("/users/sign_in", {
    method: "POST",
    body: JSON.stringify({ user: { email, password } }),
  });

  const body = await upstream.text();
  console.log("[sign_in] upstream.status:", upstream.status, "ok:", upstream.ok);
  console.log("[sign_in] upstream set-cookie count:", upstream.headers.getSetCookie().length);

  const res = new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });

  // Forward Rails' session Set-Cookie(s) to the browser.
  for (const cookie of upstream.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }

  if (upstream.ok) {
    try {
      const ws = JSON.parse(body)?.user?.workspace;
      const subdomain = ws?.subdomain ?? ws?.name;
      console.log("[sign_in] workspace:", JSON.stringify(ws), "-> subdomain:", subdomain);
      if (subdomain) {
        const attrs = [`subdomain=${encodeURIComponent(subdomain)}`, "Path=/", "HttpOnly", "SameSite=Lax"];
        if (process.env.NODE_ENV === "production") attrs.push("Secure");
        res.headers.append("set-cookie", attrs.join("; "));
        console.log("[sign_in] appended subdomain cookie:", attrs.join("; "));
      } else {
        console.log("[sign_in] no subdomain -> cookie NOT set");
      }
    } catch (e) {
      console.log("[sign_in] failed to parse body / set subdomain:", e);
    }
  }

  console.log("[sign_in] final set-cookie headers:", res.headers.getSetCookie());
  return res;
}
