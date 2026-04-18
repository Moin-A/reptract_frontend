export class ReptrackApi  {
    baseUrl: string | undefined;

    constructor() {
        this.baseUrl = process.env.API_URL
    }


    async request(
        endpoint: string,
        options: Record<string, any> = {}
    ):Promise<any> {

    const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
    };



    const config = {
    credentials: 'include' as RequestCredentials,
    ...options,
    headers
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, config);
    return res
 }
}