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

  // Bypass ReptrackApi.request here: it hardcodes a JSON Content-Type, which
  // would corrupt the multipart body. fetch sets the boundary itself when the
  // body is a FormData and no Content-Type is given.
  const api = new ReptrackApi();
  const response = await fetch(`${api.baseUrl}/accounts/import`, {
    method: "POST",
    body: forward,
    credentials: "include",
    headers: { Cookie: cookieStore.toString() },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
