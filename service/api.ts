// Build a tenant-scoped API base by prepending the workspace subdomain to the
// public API host, so Apartment resolves that tenant's schema. A leading
// "api." (prod) or "staging." (staging) on the public host is stripped first
// so every environment lands on the same *.reptrack.co.in shape — staging
// tenant traffic is routed to the staging backend at the infra layer, not by
// hostname. Protocol/port are preserved.
//   http://lvh.me:3000            -> http://ironworks.lvh.me:3000
//   https://api.reptrack.co.in     -> https://ironworks.reptrack.co.in
//   https://staging.reptrack.co.in -> https://ironworks.reptrack.co.in
export function tenantApiUrl(subdomain: string): string | undefined {
  const base = process.env.API_URL;
  if (!base) return base;
  try {
    const url = new URL(base);
    const baseHost = url.hostname.replace(/^(api|staging)\./, "");
    url.hostname = `${subdomain}.${baseHost}`;
    return url.origin;
  } catch {
    return base;
  }
}

export class ReptrackApi {
  // Resolved once per instance, lazily (see resolveBaseUrl).
  private baseUrl?: Promise<string | undefined>;

  // Pass { public: true } for auth/public endpoints (sign_in, sign_out, /me,
  // /users) — those live in the public schema and must NOT be routed to a tenant
  // subdomain (a stale subdomain cookie would otherwise send sign-in to e.g.
  // ironworks.reptrack.co.in, which may not even resolve in DNS).
  constructor(private opts: { public?: boolean } = {}) {}

  // Picks the target host from the `subdomain` cookie (set at sign-in from the
  // workspace subdomain): with a subdomain it targets that tenant's host so
  // Apartment routes to its schema; without one (or when public) it uses the
  // public API host (API_URL). Async (reads cookies), resolved lazily in request().
  private async resolveBaseUrl(): Promise<string | undefined> {
    if (!this.opts.public) {
      try {
        const { cookies } = await import("next/headers");
        const subdomain = (await cookies()).get("subdomain")?.value;
        if (subdomain) return tenantApiUrl(subdomain);
      } catch {
        // No request context (e.g. build time) — fall through to the public host.
      }
    }
    return process.env.API_URL;
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
    this.baseUrl ??= this.resolveBaseUrl();
    
    const baseUrl = await this.baseUrl;
    const res = await fetch(`${baseUrl}${endpoint}`, config);
    return res;
  }

  // Resolve the target base host (from the subdomain cookie). For routes that must
  // build the fetch themselves — e.g. streaming a multipart body straight through.
  async resolvedBaseUrl(): Promise<string | undefined> {
    this.baseUrl ??= this.resolveBaseUrl();
    return this.baseUrl;
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

export type ServerUser = {
  id: number;
  name: string;
  email: string;
  onboarded: boolean;
  workspace: { id: number; name: string } | null;
};

// Server-only: fetch the current user by forwarding session cookies.
// Call this from Server Components / proxy. The API wraps the user as
// `{ user: {...} }`, so we unwrap it here.
export async function getServerUser(): Promise<ServerUser | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const api = new ReptrackApi({ public: true });
  try {
    const res = await api.request("/users/sessions/me", {
      headers: { Cookie: cookieStore.toString() },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.user ?? null;
  } catch {
    return null;
  }
}