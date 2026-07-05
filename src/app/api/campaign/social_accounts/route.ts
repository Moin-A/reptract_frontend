import { ReptrackApi } from "../../../../../service/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/social_accounts", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

// POST /api/campaign/social_accounts — connect an account from the credentials
// form. body: { platform_tag, label, credentials: { ... } }
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const api = new ReptrackApi();

  const response = await api.request("/campaign/social_accounts", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
