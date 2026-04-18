import { ReptrackApi } from "../../../../service/api";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();
    const api = new ReptrackApi();

    const response = await api.request('/users', {
        method: 'POST',
        body: JSON.stringify({ user: { name, email, password } })
    });

    return response;
}
