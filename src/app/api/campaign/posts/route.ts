import { ReptrackApi } from "../../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/posts", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  // Stream the original multipart request straight through to Rails: this
  // preserves the client's boundary and every field (file + campaign_post[...])
  // without reparsing or rebuilding the body. `duplex: "half"` is required when
  // passing a stream as the request body.
  const response = await fetch(`${await api.resolvedBaseUrl()}/campaign/posts`, {
    method: "POST",
    body: req.body,
    duplex: "half",
    credentials: "include",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": req.headers.get("content-type") ?? "",
    },
  } as RequestInit & { duplex: "half" });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
