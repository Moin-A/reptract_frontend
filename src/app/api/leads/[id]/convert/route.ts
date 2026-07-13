import { ReptrackApi } from "../../../../../../service/api";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request(`/leads/${id}/convert`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Cookie: cookieStore.toString() },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
