import { NextResponse } from "next/server";
import { ReptrackApi } from "../../../../../../service/api";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const api = new ReptrackApi({ public: true });

  const upstream = await api.request("/users/sessions/refresh", {
    method: "POST",
    headers: { Cookie: cookieStore.toString() },
  });

  const body = await upstream.text();
  const res = new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });

  for (const cookie of upstream.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }

  return res;
}
