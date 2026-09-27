import { ReptrackApi, relayResponse } from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/groups", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return relayResponse(response);
}
