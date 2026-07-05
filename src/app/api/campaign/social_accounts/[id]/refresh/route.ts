import { ReptrackApi } from "../../../../../../../service/api";
import { cookies } from "next/headers";

// POST /api/campaign/social_accounts/:id/refresh
// Validates the account's stored credentials against the platform and returns
// the account with live metadata (name, followers, …).
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;
  const api = new ReptrackApi();

  const response = await api.request(`/campaign/social_accounts/${id}/refresh`, {
    method: "POST",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
