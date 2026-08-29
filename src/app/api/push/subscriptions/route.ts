import { cookies } from "next/headers";

// Forwards the browser's push subscription to the notif service, which owns
// subscription storage (notif is what later sends the pushes, so it needs the
// endpoint + keys).
//
// Auth: the HttpOnly push_token cookie — minted by Rails at /subscriptions/token
// and set on the browser — is read server-side here and passed to notif as a
// Bearer token, so notif can bind the subscription to the authenticated user.
//
// NOTIF_URL must be reachable from wherever the Next.js server runs:
//   - in-cluster:  http://notif-api.notif.svc.cluster.local
//   - local dev:   point at a port-forward (e.g. http://localhost:8001); the
//                  dev server on your machine cannot resolve cluster DNS.
const NOTIF_URL = process.env.NOTIF_URL ?? "http://notif-api.notif.svc.cluster.local";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("push_token")?.value;
  const body = await req.text();

  if (!token) {
    return new Response(JSON.stringify({ error: "missing push_token cookie" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("subscriptions payload:", body);

  // NOTE: confirm notif's subscribe path + body shape. This forwards the raw
  // subscription JSON ({ endpoint, keys }) to POST /notifications.
  const response = await fetch(`${NOTIF_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const text = await response.text();
  return new Response(text || null, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
