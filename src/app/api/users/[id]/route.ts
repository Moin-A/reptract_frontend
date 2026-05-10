import { ReptrackApi } from "../../../../../service/api";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = new ReptrackApi();
  return api.request(`/users/${id}`, {
    method: "GET",
    headers: { Cookie: req.headers.get("cookie") ?? "" },
  });
}
