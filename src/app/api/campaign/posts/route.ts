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
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/posts", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
