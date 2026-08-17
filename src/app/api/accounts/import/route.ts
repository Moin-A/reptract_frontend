import { ReptrackApi } from "../../../../../service/api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const incoming = await req.formData();
  const file = incoming.get("file");

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 422 });
  }

  const forward = new FormData();
  forward.append("file", file);

  // request() omits Content-Type for a FormData body, so fetch sets the multipart
  // boundary itself — and it resolves the tenant base host from the subdomain cookie.
  const api = new ReptrackApi();
  const response = await api.request("/accounts/import", {
    method: "POST",
    body: forward,
    headers: { Cookie: cookieStore.toString() },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
