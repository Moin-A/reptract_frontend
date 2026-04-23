// Update the import path below to the correct relative path where 'api' actually exists.
// For example, if 'api.ts' is in 'src/service/api.ts', use:
import { ReptrackApi } from "../../../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("users/sessions/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
}
