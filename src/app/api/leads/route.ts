import { ReptrackApi } from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const api = new ReptrackApi();
  const { search } = new URL(req.url); // "?search=…&sort=…" passthrough

  const response = await api.request(`/leads${search}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request("/leads", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Cookie: cookieStore.toString() },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
