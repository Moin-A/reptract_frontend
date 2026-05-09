import { ReptrackApi }  from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const body = await req.json().catch(() => null);
    const api = new ReptrackApi();

    const response = await api.request('/activities', {
        method: 'GET',
        body: body ? JSON.stringify(body) : undefined,
        headers: { Cookie: cookieStore.toString() },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
}
