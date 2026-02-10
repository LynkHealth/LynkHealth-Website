const TC_BASE = "https://api.secure.thoroughcare.com";
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) return cachedToken.token;
  const clientId = process.env.THOROUGHCARE_CLIENT_ID;
  const clientSecret = process.env.THOROUGHCARE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing TC credentials");
  const res = await fetch(`${TC_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

async function tcFetch(path: string, params?: Record<string, string>): Promise<any> {
  const token = await getAccessToken();
  const url = new URL(`${TC_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TC API error ${res.status}`);
  return res.json();
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function diagnose() {
  console.log("=== Multiplier Analysis: Pages 24-26 (Dec 2025 claims) ===\n");

  const allClaims: any[] = [];
  for (const pg of [24, 25, 26]) {
    const data = await tcFetch("/v1/Claim", { _lastUpdated: "ge2025-12-01,lt2026-01-01", _count: "1000", page: String(pg) });
    allClaims.push(...(data.entry || []).map((e: any) => e.resource));
    await sleep(200);
  }

  const decClaims = allClaims.filter(c => {
    const dateStr = c.billablePeriod?.start || c.item?.[0]?.servicedDate || c.created;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === 11 && d.getFullYear() === 2025;
  });

  console.log(`Dec 2025 claims (pages 24-26): ${decClaims.length}\n`);

  // Count CPT codes WITH multiplier
  const cptWithMult: Record<string, number> = {};
  const cptWithoutMult: Record<string, number> = {};
  const multiplierDist: Record<string, Record<number, number>> = {};

  for (const claim of decClaims) {
    if (!claim.procedure) continue;
    for (const proc of claim.procedure) {
      const code = proc.concept?.coding?.[0]?.code;
      const mult = proc.concept?.coding?.[0]?.multiplier || 1;
      if (!code) continue;

      cptWithMult[code] = (cptWithMult[code] || 0) + mult;
      cptWithoutMult[code] = (cptWithoutMult[code] || 0) + 1;

      if (!multiplierDist[code]) multiplierDist[code] = {};
      multiplierDist[code][mult] = (multiplierDist[code][mult] || 0) + 1;
    }
  }

  console.log("--- CPT Code Counts: With Multiplier vs Without ---");
  console.log("Code     | Without Mult | With Mult | Diff");
  console.log("---------|--------------|-----------|-----");
  for (const code of Object.keys(cptWithMult).sort()) {
    const without = cptWithoutMult[code] || 0;
    const with_ = cptWithMult[code] || 0;
    const diff = with_ - without;
    console.log(`${code.padEnd(9)}| ${String(without).padEnd(13)}| ${String(with_).padEnd(10)}| ${diff > 0 ? '+' : ''}${diff}`);
  }

  console.log("\n--- Multiplier Distribution by Code ---");
  for (const code of Object.keys(multiplierDist).sort()) {
    const dists = multiplierDist[code];
    const parts = Object.entries(dists).sort((a,b) => Number(a[0])-Number(b[0]))
      .map(([m, c]) => `x${m}=${c}`).join(", ");
    console.log(`  ${code}: ${parts}`);
  }

  // Now check if there are also "status" differences - maybe some statuses should be filtered
  const statusByCode: Record<string, Record<string, number>> = {};
  for (const claim of decClaims) {
    const status = claim.status || "null";
    if (!claim.procedure) continue;
    for (const proc of claim.procedure) {
      const code = proc.concept?.coding?.[0]?.code;
      if (!code) continue;
      if (!statusByCode[code]) statusByCode[code] = {};
      statusByCode[code][status] = (statusByCode[code][status] || 0) + 1;
    }
  }

  console.log("\n--- Status by CPT Code ---");
  for (const code of Object.keys(statusByCode).sort()) {
    const parts = Object.entries(statusByCode[code]).map(([s,c]) => `${s}=${c}`).join(", ");
    console.log(`  ${code}: ${parts}`);
  }

  // Check for claims with missing_info status specifically
  const missingInfoClaims = decClaims.filter(c => c.status === "missing_info");
  console.log(`\n--- Missing Info Claims: ${missingInfoClaims.length} ---`);
  for (const c of missingInfoClaims) {
    const procs = (c.procedure || []).map((p: any) => {
      const code = p.concept?.coding?.[0]?.code;
      const mult = p.concept?.coding?.[0]?.multiplier || 1;
      return `${code}x${mult}`;
    });
    console.log(`  Claim ${c.id}: patient=${c.patient?.reference} procs=[${procs}]`);
  }
}

diagnose().catch(err => { console.error("Error:", err); process.exit(1); });
