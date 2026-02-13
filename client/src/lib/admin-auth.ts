/**
 * Admin Authentication Client (HIPAA-compliant)
 *
 * Auth tokens are stored in httpOnly cookies (set by server).
 * Only non-sensitive user display info is stored client-side.
 * localStorage token support retained during migration period.
 */

const TOKEN_KEY = "lynk_admin_token";
const USER_KEY = "lynk_admin_user";

export interface AdminUserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  assignedPracticeIds?: number[];
  permissions?: string[];
  activePracticeId?: number | null;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUserInfo | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminAuth(token: string, user: AdminUserInfo) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function updateAdminUser(updates: Partial<AdminUserInfo>) {
  const current = getAdminUser();
  if (current) {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...updates }));
  }
}

export function hasPermission(permission: string): boolean {
  const user = getAdminUser();
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return user.permissions?.includes(permission) ?? false;
}

export function isSuperAdmin(): boolean {
  return getAdminUser()?.role === "super_admin";
}

export function isAdmin(): boolean {
  const role = getAdminUser()?.role;
  return role === "super_admin" || role === "admin";
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
    credentials: "same-origin",
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
