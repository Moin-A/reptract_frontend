import { ReptrackApi, relayResponse } from "../../../../service/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const api = new ReptrackApi();
    const { search } = new URL(req.url);

    const response = await api.request(`/activities${search}`, {
        method: 'GET',
        headers: { Cookie: cookieStore.toString() },
    });

    return relayResponse(response);
}
