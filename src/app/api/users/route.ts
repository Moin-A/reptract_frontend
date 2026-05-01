import { ReptrackApi } from "../../../../service/api";

export async function GET(req: Request) {
    const api = new ReptrackApi();
    const response = await api.request('/users', {
        method: 'GET',
        headers: { Cookie: req.headers.get('cookie') ?? '' },
    });
    return response;
}

export async function POST(req: Request) {
    const { name, email, password } = await req.json();
    const api = new ReptrackApi();

    const response = await api.request('/users', {
        method: 'POST',
        body: JSON.stringify({ user: { name, email, password } })
    });

    return response;
}
