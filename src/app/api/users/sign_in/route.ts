import { ReptrackApi } from "../../../../../service/api";

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const api = new ReptrackApi();
    
    const response = await api.request('/users/sign_in', {
      method: 'POST',
      body: JSON.stringify({ user: { email, password } })
    });
 
    return response
}
