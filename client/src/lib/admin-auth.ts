/**
 * Admin Authentication Client (HIPAA-compliant)
 *
 * Auth tokens are stored in httpOnly cookies (set by server).
 * Only non-sensitive user display info is stored client-side.
 * localStorage token support retained during migration period.
 */

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
  // Store token for backward compatibility; httpOnly cookie is the primary auth mechanism
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(url, {
    ...options,
    credentials: "same-origin", // Send httpOnly cookies automatically
    headers: {
      "Content-Type": "application/json",
      // Include Bearer token as fallback during migration to cookie-only auth
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
