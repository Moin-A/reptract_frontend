import { ReptrackApi } from "../../../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/social_accounts/connect_token", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
