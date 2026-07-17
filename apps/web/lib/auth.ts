export type AuthUser = { id: string; email?: string; role: string };
export type AuthSession = { accessToken: string; refreshToken: string; user: AuthUser };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const storageKey = "mangal.auth";

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch { return null; }
}

export function clearSession() { window.localStorage.removeItem(storageKey); }

export async function logout() {
  const session = getSession();
  if (session) await fetch(`${apiUrl}/auth/logout`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ refreshToken: session.refreshToken }) }).catch(() => undefined);
  clearSession();
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = getSession();
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  if (session?.accessToken) headers.set("authorization", `Bearer ${session.accessToken}`);
  let response = await fetch(`${apiUrl}${path}`, { ...init, headers });

  if (response.status === 401 && session?.refreshToken) {
    const refreshed = await fetch(`${apiUrl}/auth/refresh`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ refreshToken: session.refreshToken }) });
    if (refreshed.ok) {
      const next = await refreshed.json() as Omit<AuthSession, "user">;
      saveSession({ ...session, ...next });
      headers.set("authorization", `Bearer ${next.accessToken}`);
      response = await fetch(`${apiUrl}${path}`, { ...init, headers });
    } else clearSession();
  }
  return response;
}
