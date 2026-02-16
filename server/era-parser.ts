export interface EraClaimLine {
  claimId: string;
  patientName: string;
  payerClaimId: string;
  serviceDate: string;
  cptCode: string;
  modifier: string;
  units: number;
  billedCents: number;
  paidCents: number;
  allowedCents: number;
  adjustmentCents: number;
  adjustmentReason: string;
}

export interface EraParseResult {
  claims: EraClaimLine[];
  totalClaims: number;
  totalPaidCents: number;
  totalBilledCents: number;
  totalAdjustmentCents: number;
  errors: string[];
  payerName: string;
  payeeName: string;
  checkNumber: string;
}

const CPT_TO_PROGRAM: Record<string, string> = {
  "99490": "CCM", "99491": "CCM", "99437": "CCM", "99439": "CCM",
  "99457": "RPM", "99458": "RPM", "99453": "RPM", "99454": "RPM", "99091": "RPM",
  "99484": "BHI", "99492": "BHI", "99493": "BHI", "99494": "BHI",
  "99424": "PCM", "99425": "PCM", "99426": "PCM", "99427": "PCM",
  "99473": "RTM", "99474": "RTM",
  "98975": "RTM", "98976": "RTM", "98977": "RTM", "98980": "RTM", "98981": "RTM",
  "99483": "APCM", "99487": "APCM", "99489": "APCM",
  "G0556": "APCM", "G0557": "APCM", "G0558": "APCM",
  "G0438": "AWV", "G0439": "AWV",
  "99495": "TCM", "99496": "TCM",
};

export function mapCptToProgram(cptCode: string): string | null {
  const code = cptCode.replace(/^HC:/, "").split(":")[0].trim();
  return CPT_TO_PROGRAM[code] || null;
}

function parseDollars(val: string): number {
  if (!val || val.trim() === "") return 0;
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

function extractCptCode(svc01: string): { code: string; modifier: string } {
  const parts = svc01.split(":");
  const code = parts.length > 1 ? parts[1] : parts[0];
  const modifier = parts.length > 2 ? parts.slice(2).join(":") : "";
  return { code: code.trim(), modifier: modifier.trim() };
}

function parseCasSegment(seg: string[]): { adjustmentCents: number; reasons: string[] } {
  const groupCode = seg[1] || "";
  let adjustmentCents = 0;
  const reasons: string[] = [];
  let k = 2;
  while (k + 1 < seg.length) {
    const reason = seg[k] || "";
    const amount = parseDollars(seg[k + 1] || "0");
    if (reason) {
      adjustmentCents += amount;
      reasons.push(`${groupCode}-${reason}`);
    }
    k += 3;
  }
  return { adjustmentCents, reasons };
}

function detectDelimiters(content: string): { elementSep: string; segmentSep: string } {
  let elementSep = "*";
  let segmentSep = "~";

  const trimmed = content.replace(/^[\r\n\s]+/, "");
  if (trimmed.startsWith("ISA")) {
    elementSep = trimmed[3] || "*";

    const isaElements = trimmed.split(elementSep);
    if (isaElements.length >= 16) {
      const afterIsa16 = isaElements.slice(0, 16).join(elementSep).length;
      const isa16 = isaElements[16] || "";
      const restAfterIsa16 = trimmed.substring(afterIsa16 + elementSep.length + isa16.length);
      if (restAfterIsa16.length > 0) {
        const possibleSep = restAfterIsa16[0];
        if (possibleSep && possibleSep !== "\r" && possibleSep !== "\n") {
          segmentSep = possibleSep;
        }
      }
    }

    if (segmentSep === "~") {
      if (trimmed.includes("~")) {
        segmentSep = "~";
      } else if (trimmed.includes("\n")) {
        segmentSep = "\n";
      }
    }
  }

  return { elementSep, segmentSep };
}

export function parse835(content: string): EraParseResult {
  const errors: string[] = [];
  const claims: EraClaimLine[] = [];
  let payerName = "";
  let payeeName = "";
  let checkNumber = "";

  const { elementSep, segmentSep } = detectDelimiters(content);

  const rawSegments = content.split(segmentSep);
  const segments: string[][] = [];
  for (const raw of rawSegments) {
    const cleaned = raw.replace(/[\r\n]/g, "").trim();
    if (!cleaned) continue;
    segments.push(cleaned.split(elementSep));
  }

  let currentClaimId = "";
  let currentPatientName = "";
  let currentPayerClaimId = "";
  let currentClaimServiceDate = "";
  let inClaim = false;
  let inSvc = false;
  let currentSvcDate = "";
  let claimLevelAdjCents = 0;
  let claimLevelAdjReasons: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segId = seg[0];

    if (segId === "N1") {
      const qualifier = seg[1] || "";
      const name = seg[2] || "";
      if (qualifier === "PR") payerName = name;
      if (qualifier === "PE") payeeName = name;
    }

    if (segId === "TRN") {
      checkNumber = seg[2] || "";
    }

    if (segId === "CLP") {
      inClaim = true;
      inSvc = false;
      currentClaimId = seg[1] || "";
      currentPayerClaimId = seg[7] || "";
      currentPatientName = "";
      currentClaimServiceDate = "";
      currentSvcDate = "";
      claimLevelAdjCents = 0;
      claimLevelAdjReasons = [];
    }

    if (segId === "NM1" && inClaim) {
      const entityId = seg[1] || "";
      if (entityId === "QC") {
        const last = seg[3] || "";
        const first = seg[4] || "";
        currentPatientName = `${first} ${last}`.trim();
      }
    }

    if (segId === "CAS" && inClaim && !inSvc) {
      const result = parseCasSegment(seg);
      claimLevelAdjCents += result.adjustmentCents;
      claimLevelAdjReasons.push(...result.reasons);
    }

    if (segId === "DTM" && inClaim && !inSvc) {
      const qualifier = seg[1] || "";
      const dateVal = seg[2] || "";
      if (qualifier === "232" || qualifier === "233" || qualifier === "472") {
        if (!currentClaimServiceDate) currentClaimServiceDate = dateVal;
        currentSvcDate = dateVal;
      }
    }

    if (segId === "SVC" && inClaim) {
      inSvc = true;
      const { code, modifier } = extractCptCode(seg[1] || "");
      const billedCents = parseDollars(seg[2] || "0");
      const paidCents = parseDollars(seg[3] || "0");
      const units = parseInt(seg[5] || "1") || 1;

      let adjustmentCents = 0;
      let adjustmentReasons: string[] = [];
      let allowedCents = paidCents;
      let svcServiceDate = currentSvcDate || currentClaimServiceDate;

      for (let j = i + 1; j < segments.length; j++) {
        const nextSeg = segments[j];
        const nextId = nextSeg[0];
        if (nextId === "SVC" || nextId === "CLP" || nextId === "SE" || nextId === "PLB") break;

        if (nextId === "CAS") {
          const result = parseCasSegment(nextSeg);
          adjustmentCents += result.adjustmentCents;
          adjustmentReasons.push(...result.reasons);
        }
        if (nextId === "AMT") {
          const amtQual = nextSeg[1] || "";
          if (amtQual === "B6") allowedCents = parseDollars(nextSeg[2] || "0");
        }
        if (nextId === "DTM") {
          const dtmQual = nextSeg[1] || "";
          if (dtmQual === "472" || dtmQual === "150") svcServiceDate = nextSeg[2] || svcServiceDate;
        }
      }

      if (adjustmentCents === 0 && claimLevelAdjCents > 0) {
        adjustmentCents = claimLevelAdjCents;
        adjustmentReasons = [...claimLevelAdjReasons];
      }

      claims.push({
        claimId: currentClaimId,
        patientName: currentPatientName,
        payerClaimId: currentPayerClaimId,
        serviceDate: svcServiceDate,
        cptCode: code,
        modifier,
        units,
        billedCents,
        paidCents,
        allowedCents,
        adjustmentCents,
        adjustmentReason: adjustmentReasons.join(", "),
      });
    }

    if ((segId === "SE" || segId === "GE" || segId === "IEA") && inClaim) {
      inClaim = false;
      inSvc = false;
    }
  }

  if (claims.length === 0 && segments.length > 2) {
    errors.push("No claims (CLP/SVC segments) found. File may not be a valid 835 ERA format.");
  }

  const totalPaidCents = claims.reduce((s, c) => s + c.paidCents, 0);
  const totalBilledCents = claims.reduce((s, c) => s + c.billedCents, 0);
  const totalAdjustmentCents = claims.reduce((s, c) => s + c.adjustmentCents, 0);
  const uniqueClaims = new Set(claims.map(c => c.claimId)).size;

  return {
    claims,
    totalClaims: uniqueClaims,
    totalPaidCents,
    totalBilledCents,
    totalAdjustmentCents,
    errors,
    payerName,
    payeeName,
    checkNumber,
  };
}
