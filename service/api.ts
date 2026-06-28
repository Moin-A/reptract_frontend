export class ReptrackApi {
  baseUrl: string | undefined;

  constructor() {
    this.baseUrl = process.env.API_URL;
  }

  async request(endpoint: string, options: Record<string, any> = {}): Promise<any> {
    // For FormData, omit Content-Type so fetch generates
    // `multipart/form-data; boundary=…` itself — the boundary is required for
    // Rails to parse the parts (setting it by hand drops the boundary and Rails
    // mis-parses the body, e.g. "query parameters exceed limit").
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...options.headers,
    };

    const config = {
      credentials: "include" as RequestCredentials,
      ...options,
      headers,
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, config);
    return res;
  }
}

// Client-side fetch wrapper with 401 interceptor.
// Use this instead of raw fetch() in client components.
export async function clientFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, { credentials: "include", ...options });

  if (res.status === 401 && window.location.pathname !== "/") {
    window.location.href = "/";
  }

  return res;
}

export async function fetchUsers(): Promise<{ id: number; name: string; email: string; created_at: string; updated_at: string }[]> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const api = new ReptrackApi();
  try {
    const res = await api.request("/users", {
      headers: { Cookie: cookieStore.toString() },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchGroups(): Promise<{ groups: { id: number; name: string }[] }> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const api = new ReptrackApi();
  try {
    const res = await api.request("/groups", {
      headers: { Cookie: cookieStore.toString() },
    });
    if (!res.ok) return { groups: [] };
    return res.json();
  } catch {
    return { groups: [] };
  }
}

// Server-only: fetch the current user by forwarding session cookies.
// Call this from Server Components (e.g. layout.tsx).
export async function getServerUser(): Promise<{ id: number; name: string; email: string } | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const api = new ReptrackApi();
  try {
    const res = await api.request("users/sessions/me", {
      headers: { Cookie: cookieStore.toString() },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}