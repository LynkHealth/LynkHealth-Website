const TOKEN_KEY = "lynk_admin_token";
const USER_KEY = "lynk_admin_user";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): { id: number; email: string; name: string; role: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminAuth(token: string, user: { id: number; email: string; name: string; role: string }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAdminAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearAdminAuth();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  return res;
}
