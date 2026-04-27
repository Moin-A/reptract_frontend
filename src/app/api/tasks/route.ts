import { ReptrackApi } from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/tasks", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request("/tasks", {
    method: "POST",
    body: JSON.stringify({ task: body }),
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
}
