import { ReptrackApi, relayResponse } from "../../../../../service/api";
import { cookies } from "next/headers";

// POST /api/campaign/publications
// Launches a post to the given social accounts.
// body: { post_id, social_account_ids: [] }
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/publications", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return relayResponse(response);
}
