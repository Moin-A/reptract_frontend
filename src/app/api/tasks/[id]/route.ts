import { ReptrackApi } from "../../../../../service/api";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ task: body }),
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;
  const api = new ReptrackApi();

  const response = await api.request(`/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
