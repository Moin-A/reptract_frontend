import { ReptrackApi } from "../../../../../../service/api";
import { cookies } from "next/headers";

// POST /api/tasks/:id/complete — marks the task completed.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;
  const api = new ReptrackApi();

  const response = await api.request(`/tasks/${id}/complete`, {
    method: "POST",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
