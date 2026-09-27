import { ReptrackApi, relayResponse } from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const { searchParams } = new URL(req.url);

  // Build per-bucket pagination params: pagination[bucket][page_no]=n
  const params = new URLSearchParams();
  for (const [bucket, page] of searchParams.entries()) {
    params.append(`pagination[${bucket}][page_no]`, page);
  }

  const response = await api.request(`/tasks?${params}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return relayResponse(response);
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

  return relayResponse(response);
}
