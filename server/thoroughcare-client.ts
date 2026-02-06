const TC_BASE = "https://api.secure.thoroughcare.com";
const MAX_PER_PAGE = 1000;
const RATE_LIMIT_DELAY = 120;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const clientId = process.env.THOROUGHCARE_CLIENT_ID;
  const clientSecret = process.env.THOROUGHCARE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("ThoroughCare API credentials not configured");
  }

  const res = await fetch(`${TC_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
  });

  if (!res.ok) {
    throw new Error(`ThoroughCare auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

async function tcFetch(path: string, params?: Record<string, string>): Promise<any> {
  const token = await getAccessToken();
  const url = new URL(`${TC_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (res.status === 429) {
    const resetHeader = res.headers.get("X-RateLimit-Reset");
    const waitMs = resetHeader ? Math.max(0, new Date(resetHeader).getTime() - Date.now()) : 2000;
    await sleep(waitMs);
    return tcFetch(path, params);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ThoroughCare API error ${res.status}: ${body}`);
  }

  return res.json();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FHIRBundle {
  resourceType: string;
  type: string;
  entry?: Array<{ fullUrl?: string; resource: any }>;
  link?: Array<{ relation: string; url: string }>;
}

async function fetchAllPages(
  path: string,
  params?: Record<string, string>,
  onProgress?: (page: number, totalPages: number) => void,
  maxPages?: number
): Promise<any[]> {
  const allEntries: any[] = [];
  let page = 1;
  let totalPages: number | null = null;

  while (true) {
    const pageParams = { ...params, _count: String(MAX_PER_PAGE), page: String(page) };
    const data: FHIRBundle = await tcFetch(path, pageParams);

    if (totalPages === null) {
      const lastLink = data.link?.find((l) => l.relation === "last");
      if (lastLink) {
        const match = lastLink.url.match(/page=(\d+)/);
        totalPages = match ? parseInt(match[1]) : null;
      }
    }

    if (data.entry) {
      allEntries.push(...data.entry.map((e) => e.resource));
    }

    onProgress?.(page, totalPages || page);

    const hasNext = data.link?.some((l) => l.relation === "next");
    if (!hasNext || (maxPages && page >= maxPages)) break;

    page++;
    await sleep(RATE_LIMIT_DELAY);
  }

  return allEntries;
}

export async function fetchOrganizations(): Promise<any[]> {
  return fetchAllPages("/v1/Organization");
}

export async function fetchEnrollments(
  onProgress?: (page: number, total: number) => void
): Promise<any[]> {
  return fetchAllPages("/v1/EpisodeOfCare", undefined, onProgress);
}

export async function fetchTasksForPeriod(
  startDate: string,
  endDate: string,
  onProgress?: (page: number, total: number) => void
): Promise<any[]> {
  return fetchAllPages(
    "/v1/Task",
    { _lastUpdated: `ge${startDate},lt${endDate}` },
    onProgress
  );
}

export async function fetchClaimsForPeriod(
  startDate: string,
  endDate: string,
  onProgress?: (page: number, total: number) => void
): Promise<any[]> {
  return fetchAllPages(
    "/v1/Claim",
    { _lastUpdated: `ge${startDate},lt${endDate}` },
    onProgress
  );
}

export async function fetchPractitioners(): Promise<any[]> {
  return fetchAllPages("/v1/Practitioner");
}

export async function fetchPatientCount(): Promise<number> {
  const data = await tcFetch("/v1/Patient", { _count: "1" });
  const lastLink = data.link?.find((l: any) => l.relation === "last");
  if (lastLink) {
    const match = lastLink.url.match(/page=(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

export async function fetchPatientsForOrg(orgId: number): Promise<any[]> {
  return fetchAllPages("/v1/Patient", { organization: String(orgId) });
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getAccessToken();
    const orgs = await tcFetch("/v1/Organization", { _count: "1" });
    return { success: true, message: `Connected. Found organizations.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
