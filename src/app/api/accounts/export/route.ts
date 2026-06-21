import { ReptrackApi } from "../../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/accounts/export", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="accounts.xlsx"',
    },
  });
}
