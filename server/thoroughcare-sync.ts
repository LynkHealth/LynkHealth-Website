import {
  fetchOrganizations,
  fetchEnrollments,
  fetchTasksForPeriod,
  fetchPatientsForOrg,
  fetchCarePlansForPatientsBatch,
  fetchClaimsForPeriod,
  fetchAllClaims,
} from "./thoroughcare-client";
import { db } from "./db";
import { practices, programSnapshots, revenueSnapshots, tcSyncLog } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const ALL_PROGRAM_TYPES = [
  "CCM",   // Chronic Care Management
  "PCM",   // Principal Care Management
  "BHI",   // Behavioral Health Integration
  "RPM",   // Remote Patient Monitoring
  "RTM",   // Remote Therapeutic Monitoring
  "APCM",  // Advanced Primary Care Management
  "CCCM",  // Complex Chronic Care Management
  "CCO",   // Chronic Care Optimization
  "AWV",   // Annual Wellness Visit
];

interface SyncProgress {
  status: "idle" | "running" | "completed" | "error";
  step: string;
  progress: number;
  details: string;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

let currentSync: SyncProgress = {
  status: "idle",
  step: "",
  progress: 0,
  details: "",
};

export function getSyncStatus(): SyncProgress {
  return { ...currentSync };
}

function updateProgress(step: string, progress: number, details: string) {
  currentSync.step = step;
  currentSync.progress = progress;
  currentSync.details = details;
  console.log(`[TC Sync] ${step}: ${details} (${progress}%)`);
}

export async function runFullSync(month?: string, year?: number): Promise<SyncProgress> {
  if (currentSync.status === "running") {
    return currentSync;
  }

  const now = new Date();
  const targetMonth = month || MONTHS[now.getMonth()];
  const targetYear = year || now.getFullYear();

  currentSync = {
    status: "running",
    step: "Starting",
    progress: 0,
    details: "Initializing sync...",
    startedAt: now,
  };

  const [logEntry] = await db.insert(tcSyncLog).values({
    syncType: "full",
    status: "running",
    details: `Syncing ${targetMonth} ${targetYear}`,
  }).returning();

  try {
    updateProgress("Organizations", 5, "Fetching practices from ThoroughCare...");
    const orgData = await syncOrganizations();

    updateProgress("Patients", 10, "Building patient-to-practice mapping...");
    const patientData = await buildPatientOrgMap(orgData.tcOrgIds);

    updateProgress("Enrollments", 20, "Fetching enrollment data...");
    const enrollmentData = await syncEnrollments(patientData);

    updateProgress("CarePlans", 40, "Resolving program assignments for dual-enrolled patients...");
    await resolveOverlapWithCarePlans(enrollmentData);

    updateProgress("Time Logs", 55, `Fetching time logs for ${targetMonth} ${targetYear}...`);
    const timeData = await syncTimeLogs(targetMonth, targetYear);

    updateProgress("Snapshots", 80, "Building program snapshots...");
    await buildSnapshots(enrollmentData, timeData, targetMonth, targetYear);

    updateProgress("Complete", 100, `Sync completed successfully`);
    currentSync.status = "completed";
    currentSync.completedAt = new Date();

    const totalRecords = enrollmentData.totalEnrollments + timeData.totalLogs;
    await db.update(tcSyncLog).set({
      status: "completed",
      recordsProcessed: totalRecords,
      details: `Synced: ${enrollmentData.totalEnrollments} enrollments, ${timeData.totalLogs} time logs for ${targetMonth} ${targetYear}`,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  } catch (error: any) {
    currentSync.status = "error";
    currentSync.error = error.message;
    console.error("[TC Sync] Error:", error);

    await db.update(tcSyncLog).set({
      status: "error",
      details: error.message,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  }
}

function generateMonthRange(totalMonths: number): Array<{ month: string; year: number }> {
  const now = new Date();
  const months: Array<{ month: string; year: number }> = [];
  for (let i = 0; i < totalMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: MONTHS[d.getMonth()], year: d.getFullYear() });
  }
  return months;
}

export async function runHistoricalSync(totalMonths: number = 24): Promise<SyncProgress> {
  if (currentSync.status === "running") {
    return currentSync;
  }

  const now = new Date();
  const monthRange = generateMonthRange(totalMonths);

  currentSync = {
    status: "running",
    step: "Starting",
    progress: 0,
    details: `Initializing historical sync (${totalMonths} months)...`,
    startedAt: now,
  };

  const [logEntry] = await db.insert(tcSyncLog).values({
    syncType: "historical",
    status: "running",
    details: `Historical sync: ${totalMonths} months`,
  }).returning();

  try {
    updateProgress("Organizations", 2, "Fetching practices from ThoroughCare...");
    const orgData = await syncOrganizations();

    updateProgress("Patients", 5, "Building patient-to-practice mapping...");
    const patientData = await buildPatientOrgMap(orgData.tcOrgIds);

    updateProgress("Enrollments", 10, "Fetching enrollment data...");
    const enrollmentData = await syncEnrollments(patientData);

    updateProgress("CarePlans", 18, "Resolving program assignments for dual-enrolled patients...");
    await resolveOverlapWithCarePlans(enrollmentData);

    let totalTimeLogs = 0;
    const monthProgressBase = 25;
    const monthProgressRange = 70;

    for (let i = 0; i < monthRange.length; i++) {
      const { month, year } = monthRange[i];
      const monthLabel = `${month} ${year}`;
      const monthPct = monthProgressBase + Math.round((i / monthRange.length) * monthProgressRange);

      updateProgress("Historical Sync", monthPct, `Month ${i + 1}/${monthRange.length}: Fetching time logs for ${monthLabel}...`);
      const timeData = await syncTimeLogs(month, year);
      totalTimeLogs += timeData.totalLogs;

      updateProgress("Historical Sync", monthPct + Math.round(monthProgressRange / monthRange.length / 2), `Month ${i + 1}/${monthRange.length}: Building snapshots for ${monthLabel}...`);
      await buildSnapshots(enrollmentData, timeData, month, year);
    }

    updateProgress("Complete", 100, `Historical sync completed: ${totalMonths} months, ${totalTimeLogs} total time logs`);
    currentSync.status = "completed";
    currentSync.completedAt = new Date();

    await db.update(tcSyncLog).set({
      status: "completed",
      recordsProcessed: enrollmentData.totalEnrollments + totalTimeLogs,
      details: `Historical sync: ${totalMonths} months, ${enrollmentData.totalEnrollments} enrollments, ${totalTimeLogs} time logs`,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  } catch (error: any) {
    currentSync.status = "error";
    currentSync.error = error.message;
    console.error("[TC Historical Sync] Error:", error);

    await db.update(tcSyncLog).set({
      status: "error",
      details: error.message,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  }
}

interface OrgSyncResult {
  tcOrgIds: number[];
  orgToDbMap: Map<number, number>;
}

async function syncOrganizations(): Promise<OrgSyncResult> {
  const orgs = await fetchOrganizations();
  const orgToDbMap = new Map<number, number>();
  const tcOrgIds: number[] = [];

  for (const org of orgs) {
    const tcId = org.id;
    const name = org.name || "Unknown";
    const alias = org.alias || null;
    const active = org.active !== false;

    tcOrgIds.push(tcId);

    const deptNames: string[] = [];
    if (org.extension) {
      for (const ext of org.extension) {
        if (ext.url?.includes("organization-department") && ext.value?.text) {
          deptNames.push(ext.value.text);
        }
      }
    }

    const [existing] = await db.select().from(practices).where(eq(practices.thoroughcareId, tcId));

    if (existing) {
      await db.update(practices).set({
        name,
        thoroughcareAlias: alias,
        status: active ? "active" : "inactive",
        departments: deptNames.length > 0 ? JSON.stringify(deptNames) : null,
      }).where(eq(practices.id, existing.id));
      orgToDbMap.set(tcId, existing.id);
    } else {
      const [newPractice] = await db.insert(practices).values({
        name,
        thoroughcareId: tcId,
        thoroughcareAlias: alias,
        status: active ? "active" : "inactive",
        departments: deptNames.length > 0 ? JSON.stringify(deptNames) : null,
      }).returning();
      orgToDbMap.set(tcId, newPractice.id);
    }
  }

  updateProgress("Organizations", 8, `Synced ${orgs.length} practices`);
  return { tcOrgIds, orgToDbMap };
}

interface PatientData {
  orgMap: Map<string, number>;
  deptMap: Map<string, string>;
  inactivePatients: Set<string>;
}

async function buildPatientOrgMap(tcOrgIds: number[]): Promise<PatientData> {
  const orgMap = new Map<string, number>();
  const deptMap = new Map<string, string>();
  const inactivePatients = new Set<string>();

  for (let i = 0; i < tcOrgIds.length; i++) {
    const orgId = tcOrgIds[i];
    updateProgress("Patients", 10 + Math.round((i / tcOrgIds.length) * 8), `Fetching patients for org ${i + 1}/${tcOrgIds.length}...`);

    try {
      const patients = await fetchPatientsForOrg(orgId);
      for (const patient of patients) {
        const patientId = String(patient.id);
        orgMap.set(patientId, orgId);
        const deptExt = patient.extension?.find((e: any) => e.url === "department");
        if (deptExt?.value) {
          deptMap.set(patientId, deptExt.value);
        }
        const flags = patient.extension?.find((e: any) => e.url === "flags")?.value || [];
        if (flags.includes("INACTIVE")) {
          inactivePatients.add(patientId);
        }
      }
    } catch (err) {
      console.error(`[TC Sync] Error fetching patients for org ${orgId}:`, err);
    }
  }

  const deptCount = new Set(deptMap.values()).size;
  updateProgress("Patients", 18, `Mapped ${orgMap.size} patients to ${tcOrgIds.length} organizations (${inactivePatients.size} inactive, ${deptCount} departments)`);
  return { orgMap, deptMap, inactivePatients };
}

interface ProgramStats {
  active: number;
  inactive: number;
  total: number;
  activePatientIds: Set<string>;
}

interface EnrollmentData {
  totalEnrollments: number;
  byOrg: Map<number, Map<string, ProgramStats>>;
  byOrgDept: Map<number, Map<string, Map<string, ProgramStats>>>;
}

function getOrCreateStats(map: Map<string, ProgramStats>, key: string): ProgramStats {
  if (!map.has(key)) {
    map.set(key, { active: 0, inactive: 0, total: 0, activePatientIds: new Set() });
  }
  return map.get(key)!;
}

async function syncEnrollments(patientData: PatientData): Promise<EnrollmentData> {
  const { orgMap, deptMap, inactivePatients } = patientData;

  const enrollments = await fetchEnrollments((page, total) => {
    const pct = Math.min(20 + Math.round((page / total) * 18), 38);
    updateProgress("Enrollments", pct, `Fetching enrollments page ${page}/${total}...`);
  });

  const byOrg = new Map<number, Map<string, ProgramStats>>();
  const byOrgDept = new Map<number, Map<string, Map<string, ProgramStats>>>();

  for (const enrollment of enrollments) {
    const patientRef = enrollment.patient?.reference;
    let programCode = enrollment.type?.coding?.[0]?.code;

    if (!programCode || !patientRef) continue;

    programCode = programCode.toUpperCase();

    const patientId = patientRef.replace("Patient/", "");
    const tcOrgId = orgMap.get(patientId) || 0;
    const dept = deptMap.get(patientId) || null;

    if (!byOrg.has(tcOrgId)) byOrg.set(tcOrgId, new Map());
    const orgStats = getOrCreateStats(byOrg.get(tcOrgId)!, programCode);
    orgStats.total++;

    let deptStats: ProgramStats | null = null;
    if (dept) {
      if (!byOrgDept.has(tcOrgId)) byOrgDept.set(tcOrgId, new Map());
      const orgDepts = byOrgDept.get(tcOrgId)!;
      if (!orgDepts.has(dept)) orgDepts.set(dept, new Map());
      deptStats = getOrCreateStats(orgDepts.get(dept)!, programCode);
      deptStats.total++;
    }

    const isActive = enrollment.status?.toLowerCase() === "active";
    const isPatientInactive = inactivePatients.has(patientId);

    if (isActive && !isPatientInactive) {
      orgStats.active++;
      orgStats.activePatientIds.add(patientId);
      if (deptStats) {
        deptStats.active++;
        deptStats.activePatientIds.add(patientId);
      }
    } else {
      orgStats.inactive++;
      if (deptStats) deptStats.inactive++;
    }
  }

  let orgSummary = "";
  byOrg.forEach((programs, orgId) => {
    let total = 0;
    programs.forEach((stats) => { total += stats.activePatientIds.size; });
    if (total > 0) orgSummary += `org${orgId}:${total} `;
  });

  updateProgress("Enrollments", 38, `Processed ${enrollments.length} enrollments (${orgSummary.trim()})`);
  return { totalEnrollments: enrollments.length, byOrg, byOrgDept };
}

async function resolveOverlapWithCarePlans(enrollmentData: EnrollmentData): Promise<void> {
  const CONFLICTING_PROGRAMS = ["CCM", "PCM", "CCCM", "APCM"];

  let totalOverlap = 0;
  const overlapByOrg = new Map<number, string[]>();

  const orgEntries = Array.from(enrollmentData.byOrg.entries());
  for (const [orgId, programs] of orgEntries) {
    const programSets = new Map<string, Set<string>>();
    for (const prog of CONFLICTING_PROGRAMS) {
      const stats = programs.get(prog);
      if (stats && stats.activePatientIds.size > 0) {
        programSets.set(prog, stats.activePatientIds);
      }
    }

    if (programSets.size < 2) continue;

    const overlapPatients = new Set<string>();
    const allPatientSets = Array.from(programSets.values());
    for (let i = 0; i < allPatientSets.length; i++) {
      for (let j = i + 1; j < allPatientSets.length; j++) {
        const setI = Array.from(allPatientSets[i]);
        for (const pid of setI) {
          if (allPatientSets[j].has(pid)) {
            overlapPatients.add(pid);
          }
        }
      }
    }

    if (overlapPatients.size === 0) continue;

    totalOverlap += overlapPatients.size;
    overlapByOrg.set(orgId, Array.from(overlapPatients));
  }

  if (totalOverlap === 0) {
    updateProgress("CarePlans", 50, "No dual-enrolled patients found, skipping CarePlan resolution");
    return;
  }

  updateProgress("CarePlans", 42, `Found ${totalOverlap} dual-enrolled patients across ${overlapByOrg.size} orgs. Fetching CarePlans...`);

  let resolved = 0;
  let totalProcessed = 0;

  const overlapEntries = Array.from(overlapByOrg.entries());
  for (const [orgId, patientIds] of overlapEntries) {
    const programs = enrollmentData.byOrg.get(orgId)!;

    const carePlans = await fetchCarePlansForPatientsBatch(patientIds, (completed, total) => {
      const pct = 42 + Math.round(((totalProcessed + completed) / totalOverlap) * 10);
      updateProgress("CarePlans", Math.min(pct, 52), `Fetching CarePlans: ${totalProcessed + completed}/${totalOverlap}...`);
    });

    const carePlanEntries = Array.from(carePlans.entries());
    for (const [patientId, activeCarePlans] of carePlanEntries) {
      const enrolledIn: string[] = [];
      for (const prog of CONFLICTING_PROGRAMS) {
        if (programs.get(prog)?.activePatientIds.has(patientId)) {
          enrolledIn.push(prog);
        }
      }

      if (enrolledIn.length < 2) continue;

      const carePlanPrograms = new Set(activeCarePlans);

      const PROGRAM_PRIORITY = ["PCM", "APCM", "CCCM", "CCM"];
      let primaryProgram: string | null = null;
      for (const prog of PROGRAM_PRIORITY) {
        if (enrolledIn.includes(prog) && carePlanPrograms.has(prog)) {
          primaryProgram = prog;
          break;
        }
      }
      if (!primaryProgram) {
        for (const prog of PROGRAM_PRIORITY) {
          if (enrolledIn.includes(prog)) {
            primaryProgram = prog;
            break;
          }
        }
      }
      if (!primaryProgram) {
        primaryProgram = enrolledIn[0];
      }

      for (const prog of enrolledIn) {
        if (prog !== primaryProgram) {
          const stats = programs.get(prog)!;
          if (stats.activePatientIds.has(patientId)) {
            stats.activePatientIds.delete(patientId);
            stats.active--;
            stats.inactive++;
            resolved++;

            const orgDepts = enrollmentData.byOrgDept.get(orgId);
            if (orgDepts) {
              for (const [, deptPrograms] of Array.from(orgDepts.entries())) {
                const deptStats = deptPrograms.get(prog);
                if (deptStats?.activePatientIds.has(patientId)) {
                  deptStats.activePatientIds.delete(patientId);
                  deptStats.active--;
                  deptStats.inactive++;
                }
              }
            }
          }
        }
      }
    }

    totalProcessed += patientIds.length;
  }

  const postSummary: string[] = [];
  const postOrgEntries = Array.from(enrollmentData.byOrg.entries());
  for (const [orgId, programs] of postOrgEntries) {
    for (const prog of CONFLICTING_PROGRAMS) {
      const stats = programs.get(prog);
      if (stats && stats.activePatientIds.size > 0) {
        postSummary.push(`org${orgId} ${prog}:${stats.activePatientIds.size}`);
      }
    }
  }

  updateProgress("CarePlans", 53, `Resolved ${resolved} dual-enrollments. Post-dedup: ${postSummary.join(", ")}`);
}

interface TimeData {
  totalLogs: number;
  patientMinutes: Map<string, Map<string, number>>;
}

async function syncTimeLogs(month: string, year: number): Promise<TimeData> {
  const monthIdx = MONTHS.indexOf(month);
  const startDate = new Date(year, monthIdx, 1);
  const endDate = new Date(year, monthIdx + 1, 1);
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  let tasks: any[];
  try {
    tasks = await fetchTasksForPeriod(startStr, endStr, (page, total) => {
      const pct = Math.min(55 + Math.round((page / total) * 20), 75);
      updateProgress("Time Logs", pct, `Fetching time logs page ${page}/${total}...`);
    });
  } catch (error) {
    console.error("[TC Sync] Error fetching tasks:", error);
    tasks = [];
  }

  const patientMinutes = new Map<string, Map<string, number>>();

  for (const task of tasks) {
    const patientRef = task.for?.reference;
    let programCode = task.code?.coding?.[0]?.code;
    const description = task.description || "";

    if (!patientRef || !programCode) continue;

    programCode = programCode.toUpperCase();
    const patientId = patientRef.replace("Patient/", "");
    const secondsMatch = description.match(/(\d+)\s*seconds/);
    let minutes = 0;

    if (secondsMatch) {
      minutes = Math.round(parseInt(secondsMatch[1]) / 60);
    } else if (task.executionPeriod?.start && task.executionPeriod?.end) {
      const start = new Date(task.executionPeriod.start).getTime();
      const end = new Date(task.executionPeriod.end).getTime();
      minutes = Math.round((end - start) / 60000);
    }

    if (!patientMinutes.has(patientId)) {
      patientMinutes.set(patientId, new Map());
    }
    const programMins = patientMinutes.get(patientId)!;
    programMins.set(programCode, (programMins.get(programCode) || 0) + minutes);
  }

  updateProgress("Time Logs", 75, `Processed ${tasks.length} time logs for ${patientMinutes.size} patients`);
  return { totalLogs: tasks.length, patientMinutes };
}

function buildSnapshotForProgram(
  programType: string,
  enrollment: ProgramStats,
  timeData: TimeData,
): Record<string, any> {
  const patientsEnrolled = enrollment.activePatientIds.size;
  const inactive = enrollment.inactive;

  const patientMinutesList: number[] = [];
  let patientsWithTime = 0;

  const activeIds = Array.from(enrollment.activePatientIds);
  for (const patientId of activeIds) {
    const patientPrograms = timeData.patientMinutes.get(patientId);
    if (patientPrograms) {
      const programMinutes = patientPrograms.get(programType);
      if (programMinutes !== undefined) {
        patientMinutesList.push(programMinutes);
        patientsWithTime++;
      } else if ((programType === "PCM" || programType === "CCCM" || programType === "APCM") && patientPrograms.has("CCM")) {
        patientMinutesList.push(patientPrograms.get("CCM")!);
        patientsWithTime++;
      }
    }
  }

  const timeBuckets = categorizeMinutes(programType, patientMinutesList);
  timeBuckets.mins0 = Math.max(0, patientsEnrolled - patientsWithTime);

  return {
    programType,
    patientsEnrolled,
    notEnrolled: 0,
    inactive,
    source: "thoroughcare",
    syncedAt: new Date(),
    ...timeBuckets,
  };
}

async function buildSnapshots(
  enrollmentData: EnrollmentData,
  timeData: TimeData,
  month: string,
  year: number
) {
  const allPractices = await db.select().from(practices);
  const tcIdToDbId = new Map<number, number>();
  for (const p of allPractices) {
    if (p.thoroughcareId) {
      tcIdToDbId.set(p.thoroughcareId, p.id);
    }
  }

  await db.delete(programSnapshots)
    .where(and(eq(programSnapshots.month, month), eq(programSnapshots.year, year)));

  const orgEntries = Array.from(enrollmentData.byOrg.entries());
  for (const [tcOrgId, programs] of orgEntries) {
    let dbPracticeId: number | undefined;

    if (tcOrgId === 0) {
      dbPracticeId = allPractices[0]?.id;
    } else {
      dbPracticeId = tcIdToDbId.get(tcOrgId);
    }

    if (!dbPracticeId) continue;

    for (const programType of ALL_PROGRAM_TYPES) {
      const enrollment = programs.get(programType);
      if (!enrollment || (enrollment.activePatientIds.size === 0 && enrollment.inactive === 0)) continue;

      const snapshotData = buildSnapshotForProgram(programType, enrollment, timeData);
      await db.insert(programSnapshots).values({
        practiceId: dbPracticeId,
        department: null,
        month,
        year,
        ...snapshotData,
      } as any);
    }

    const orgDepts = enrollmentData.byOrgDept.get(tcOrgId);
    if (orgDepts) {
      for (const [deptName, deptPrograms] of Array.from(orgDepts.entries())) {
        for (const programType of ALL_PROGRAM_TYPES) {
          const enrollment = deptPrograms.get(programType);
          if (!enrollment || (enrollment.activePatientIds.size === 0 && enrollment.inactive === 0)) continue;

          const snapshotData = buildSnapshotForProgram(programType, enrollment, timeData);
          await db.insert(programSnapshots).values({
            practiceId: dbPracticeId,
            department: deptName,
            month,
            year,
            ...snapshotData,
          } as any);
        }
      }
    }
  }

  updateProgress("Snapshots", 95, `Built per-practice and per-department program snapshots for ${month} ${year}`);
}

const CPT_RATES: Record<string, number> = {
  "99490": 6200, "99439": 4700, "99491": 8300, "99487": 9300, "99489": 7500,
  "99457": 5000, "99458": 4200, "99473": 1100, "99474": 6300,
  "99453": 1900, "99454": 6400, "99091": 5600,
  "99426": 7100, "99427": 5300,
  "99484": 5100,
  "99424": 8300, "99425": 7100,
  "G0506": 7400, "G2064": 7100, "G2065": 5300,
  "99497": 8600, "99498": 7500,
  "G0438": 17200, "G0439": 11800,
  "99483": 28200,
};

function getClaimServiceMonth(claim: any): { month: string; year: number } | null {
  const dateStr = claim.billablePeriod?.start || claim.item?.[0]?.servicedDate || claim.created;
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

function programFromClaimCode(code: string): string | null {
  const map: Record<string, string> = {
    "CCM": "CCM", "Chronic Care Management": "CCM",
    "PCM": "PCM", "Principal Care Management": "PCM",
    "BHI": "BHI", "Behavioral Health Integration": "BHI",
    "RPM": "RPM", "Remote Patient Monitoring": "RPM",
    "RTM": "RTM", "Remote Therapeutic Monitoring": "RTM",
    "APCM": "APCM", "Advanced Primary Care Management": "APCM",
    "CCCM": "CCCM", "Complex Chronic Care Management": "CCCM",
    "CCO": "CCO", "Chronic Care Optimization": "CCO",
    "AWV": "AWV", "Annual Wellness Visit": "AWV",
  };
  return map[code] || null;
}

function processClaimData(
  claim: any,
  orgMap: Map<string, number>,
  deptMap: Map<string, string>,
  tcIdToDbId: Map<number, number>,
  allPractices: any[]
): { practiceId: number; department: string | null; programType: string; revenue: number } | null {
  const patientRef = claim.patient?.reference;
  if (!patientRef) return null;

  const patientId = patientRef.replace("Patient/", "");
  const tcOrgId = orgMap.get(patientId) || 0;
  const dept = deptMap.get(patientId) || null;

  let dbPracticeId: number | undefined;
  if (tcOrgId === 0) {
    dbPracticeId = allPractices[0]?.id;
  } else {
    dbPracticeId = tcIdToDbId.get(tcOrgId);
  }
  if (!dbPracticeId) return null;

  let programType: string | null = null;
  if (claim.item?.[0]?.productOrService?.coding?.[0]?.code) {
    programType = programFromClaimCode(claim.item[0].productOrService.coding[0].code);
  }
  if (!programType && claim.supportingInfo?.[0]?.valueString) {
    const info = claim.supportingInfo[0].valueString;
    for (const prog of ALL_PROGRAM_TYPES) {
      if (info.toUpperCase().includes(prog)) {
        programType = prog;
        break;
      }
    }
  }
  if (!programType) programType = "OTHER";

  let claimRevenue = 0;
  if (claim.procedure) {
    for (const proc of claim.procedure) {
      const cptCode = proc.concept?.coding?.[0]?.code;
      const multiplier = proc.concept?.coding?.[0]?.multiplier || 1;
      if (cptCode && CPT_RATES[cptCode]) {
        claimRevenue += CPT_RATES[cptCode] * multiplier;
      }
    }
  }

  return { practiceId: dbPracticeId, department: dept, programType, revenue: claimRevenue };
}

async function storeRevenueForMonth(
  month: string,
  year: number,
  revenueByKey: Map<string, { practiceId: number; department: string | null; programType: string; revenue: number; count: number }>
) {
  await db.delete(revenueSnapshots)
    .where(and(eq(revenueSnapshots.month, month), eq(revenueSnapshots.year, year)));

  for (const entry of Array.from(revenueByKey.values())) {
    await db.insert(revenueSnapshots).values({
      practiceId: entry.practiceId,
      department: entry.department,
      programType: entry.programType,
      month,
      year,
      claimCount: entry.count,
      totalRevenue: entry.revenue,
      source: "thoroughcare",
      syncedAt: new Date(),
    });
  }
}

async function syncClaimsForMonth(
  month: string,
  year: number,
  patientData: PatientData
): Promise<{ totalClaims: number; totalRevenueCents: number }> {
  const monthIdx = MONTHS.indexOf(month);
  const startDate = new Date(year, monthIdx, 1);
  const endDate = new Date(year, monthIdx + 1, 1);
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  let claims: any[];
  try {
    claims = await fetchClaimsForPeriod(startStr, endStr, (page, total) => {
      updateProgress("Claims", 0, `Fetching claims page ${page}/${total} for ${month} ${year}...`);
    });
  } catch (error) {
    console.error(`[TC Sync] Error fetching claims for ${month} ${year}:`, error);
    claims = [];
  }

  const filteredClaims = claims.filter((claim) => {
    const svcMonth = getClaimServiceMonth(claim);
    return svcMonth && svcMonth.month === month && svcMonth.year === year;
  });

  console.log(`[TC Sync] Claims fetched: ${claims.length} by _lastUpdated, ${filteredClaims.length} with service date in ${month} ${year}`);

  if (filteredClaims.length === 0) {
    await db.delete(revenueSnapshots)
      .where(and(eq(revenueSnapshots.month, month), eq(revenueSnapshots.year, year)));
    return { totalClaims: 0, totalRevenueCents: 0 };
  }

  const { orgMap, deptMap } = patientData;
  const allPractices = await db.select().from(practices);
  const tcIdToDbId = new Map<number, number>();
  for (const p of allPractices) {
    if (p.thoroughcareId) tcIdToDbId.set(p.thoroughcareId, p.id);
  }

  const revenueByKey = new Map<string, { practiceId: number; department: string | null; programType: string; revenue: number; count: number }>();
  let totalRevenueCents = 0;

  for (const claim of filteredClaims) {
    const result = processClaimData(claim, orgMap, deptMap, tcIdToDbId, allPractices);
    if (!result) continue;

    totalRevenueCents += result.revenue;

    const orgKey = `${result.practiceId}|null|${result.programType}`;
    if (!revenueByKey.has(orgKey)) {
      revenueByKey.set(orgKey, { practiceId: result.practiceId, department: null, programType: result.programType, revenue: 0, count: 0 });
    }
    const orgEntry = revenueByKey.get(orgKey)!;
    orgEntry.revenue += result.revenue;
    orgEntry.count++;

    if (result.department) {
      const deptKey = `${result.practiceId}|${result.department}|${result.programType}`;
      if (!revenueByKey.has(deptKey)) {
        revenueByKey.set(deptKey, { practiceId: result.practiceId, department: result.department, programType: result.programType, revenue: 0, count: 0 });
      }
      const deptEntry = revenueByKey.get(deptKey)!;
      deptEntry.revenue += result.revenue;
      deptEntry.count++;
    }
  }

  await storeRevenueForMonth(month, year, revenueByKey);
  return { totalClaims: filteredClaims.length, totalRevenueCents };
}

export async function runRevenueSync(month?: string, year?: number): Promise<SyncProgress> {
  if (currentSync.status === "running") {
    return currentSync;
  }

  const now = new Date();
  const targetMonth = month || MONTHS[now.getMonth()];
  const targetYear = year || now.getFullYear();

  currentSync = {
    status: "running",
    step: "Starting",
    progress: 0,
    details: "Initializing revenue sync...",
    startedAt: now,
  };

  const [logEntry] = await db.insert(tcSyncLog).values({
    syncType: "revenue",
    status: "running",
    details: `Revenue sync for ${targetMonth} ${targetYear}`,
  }).returning();

  try {
    updateProgress("Organizations", 5, "Fetching practices...");
    const orgData = await syncOrganizations();

    updateProgress("Patients", 15, "Building patient-to-practice mapping...");
    const patientData = await buildPatientOrgMap(orgData.tcOrgIds);

    updateProgress("Claims", 30, `Fetching claims for ${targetMonth} ${targetYear}...`);
    const result = await syncClaimsForMonth(targetMonth, targetYear, patientData);

    const revDollars = (result.totalRevenueCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
    updateProgress("Complete", 100, `Revenue sync completed: ${result.totalClaims} claims, ${revDollars} total`);
    currentSync.status = "completed";
    currentSync.completedAt = new Date();

    await db.update(tcSyncLog).set({
      status: "completed",
      recordsProcessed: result.totalClaims,
      details: `Revenue sync: ${result.totalClaims} claims, ${revDollars} for ${targetMonth} ${targetYear}`,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  } catch (error: any) {
    currentSync.status = "error";
    currentSync.error = error.message;
    console.error("[TC Revenue Sync] Error:", error);

    await db.update(tcSyncLog).set({
      status: "error",
      details: error.message,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  }
}

export async function runHistoricalRevenueSync(totalMonths: number = 24): Promise<SyncProgress> {
  if (currentSync.status === "running") {
    return currentSync;
  }

  const now = new Date();
  const monthRange = generateMonthRange(totalMonths);
  const validMonths = new Set(monthRange.map(m => `${m.month}-${m.year}`));

  currentSync = {
    status: "running",
    step: "Starting",
    progress: 0,
    details: `Initializing historical revenue sync (${totalMonths} months)...`,
    startedAt: now,
  };

  const [logEntry] = await db.insert(tcSyncLog).values({
    syncType: "historical_revenue",
    status: "running",
    details: `Historical revenue sync: ${totalMonths} months`,
  }).returning();

  try {
    updateProgress("Organizations", 3, "Fetching practices...");
    const orgData = await syncOrganizations();

    updateProgress("Patients", 8, "Building patient-to-practice mapping...");
    const patientData = await buildPatientOrgMap(orgData.tcOrgIds);
    const { orgMap, deptMap } = patientData;

    const allPractices = await db.select().from(practices);
    const tcIdToDbId = new Map<number, number>();
    for (const p of allPractices) {
      if (p.thoroughcareId) tcIdToDbId.set(p.thoroughcareId, p.id);
    }

    updateProgress("Claims", 15, "Fetching all claims from ThoroughCare...");
    let allClaims: any[];
    try {
      allClaims = await fetchAllClaims((page, total) => {
        updateProgress("Claims", 15 + Math.round((page / Math.max(total, 1)) * 30), `Fetching claims page ${page}/${total}...`);
      });
    } catch (error) {
      console.error("[TC Historical Revenue Sync] Error fetching claims:", error);
      allClaims = [];
    }

    console.log(`[TC Historical Revenue Sync] Fetched ${allClaims.length} total claims, bucketing by service date...`);

    const claimsByMonth = new Map<string, any[]>();
    let skippedNoDate = 0;
    let skippedOutOfRange = 0;

    for (const claim of allClaims) {
      const svcMonth = getClaimServiceMonth(claim);
      if (!svcMonth) { skippedNoDate++; continue; }
      const key = `${svcMonth.month}-${svcMonth.year}`;
      if (!validMonths.has(key)) { skippedOutOfRange++; continue; }
      if (!claimsByMonth.has(key)) claimsByMonth.set(key, []);
      claimsByMonth.get(key)!.push(claim);
    }

    console.log(`[TC Historical Revenue Sync] Bucketed into ${claimsByMonth.size} months (${skippedNoDate} no date, ${skippedOutOfRange} out of range)`);

    let totalClaims = 0;
    let totalRevenueCents = 0;
    let monthIdx = 0;

    for (const { month, year } of monthRange) {
      const pct = 50 + Math.round((monthIdx / monthRange.length) * 45);
      const key = `${month}-${year}`;
      const monthClaims = claimsByMonth.get(key) || [];
      updateProgress("Processing", pct, `Processing ${month} ${year}: ${monthClaims.length} claims...`);

      const revenueByKey = new Map<string, { practiceId: number; department: string | null; programType: string; revenue: number; count: number }>();

      for (const claim of monthClaims) {
        const result = processClaimData(claim, orgMap, deptMap, tcIdToDbId, allPractices);
        if (!result) continue;

        totalRevenueCents += result.revenue;
        totalClaims++;

        const orgKey = `${result.practiceId}|null|${result.programType}`;
        if (!revenueByKey.has(orgKey)) {
          revenueByKey.set(orgKey, { practiceId: result.practiceId, department: null, programType: result.programType, revenue: 0, count: 0 });
        }
        const orgEntry = revenueByKey.get(orgKey)!;
        orgEntry.revenue += result.revenue;
        orgEntry.count++;

        if (result.department) {
          const deptKey = `${result.practiceId}|${result.department}|${result.programType}`;
          if (!revenueByKey.has(deptKey)) {
            revenueByKey.set(deptKey, { practiceId: result.practiceId, department: result.department, programType: result.programType, revenue: 0, count: 0 });
          }
          const deptEntry = revenueByKey.get(deptKey)!;
          deptEntry.revenue += result.revenue;
          deptEntry.count++;
        }
      }

      await storeRevenueForMonth(month, year, revenueByKey);
      monthIdx++;
    }

    const revDollars = (totalRevenueCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
    updateProgress("Complete", 100, `Historical revenue sync: ${totalMonths} months, ${totalClaims} claims, ${revDollars}`);
    currentSync.status = "completed";
    currentSync.completedAt = new Date();

    await db.update(tcSyncLog).set({
      status: "completed",
      recordsProcessed: totalClaims,
      details: `Historical revenue: ${totalMonths} months, ${totalClaims} claims, ${revDollars}`,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  } catch (error: any) {
    currentSync.status = "error";
    currentSync.error = error.message;
    console.error("[TC Historical Revenue Sync] Error:", error);

    await db.update(tcSyncLog).set({
      status: "error",
      details: error.message,
      completedAt: new Date(),
    }).where(eq(tcSyncLog.id, logEntry.id));

    return currentSync;
  }
}

function categorizeMinutes(programType: string, minutesList: number[]): Record<string, number> {
  const buckets: Record<string, number> = {
    mins0: 0,
    mins1to4: 0,
    mins1to9: 0,
    mins1to29: 0,
    mins5to9: 0,
    mins10to14: 0,
    mins10to19: 0,
    mins15to19: 0,
    mins20to39: 0,
    mins20Plus: 0,
    mins30to59: 0,
    mins40to59: 0,
    mins40Plus: 0,
    mins60Plus: 0,
  };

  for (const mins of minutesList) {
    if (mins === 0) {
      buckets.mins0++;
    } else {
      if (mins >= 1 && mins <= 4) buckets.mins1to4++;
      if (mins >= 1 && mins <= 9) buckets.mins1to9++;
      if (mins >= 1 && mins <= 29) buckets.mins1to29++;
      if (mins >= 5 && mins <= 9) buckets.mins5to9++;
      if (mins >= 10 && mins <= 14) buckets.mins10to14++;
      if (mins >= 10 && mins <= 19) buckets.mins10to19++;
      if (mins >= 15 && mins <= 19) buckets.mins15to19++;
      if (mins >= 20 && mins <= 39) buckets.mins20to39++;
      if (mins >= 20) buckets.mins20Plus++;
      if (mins >= 30 && mins <= 59) buckets.mins30to59++;
      if (mins >= 40 && mins <= 59) buckets.mins40to59++;
      if (mins >= 40) buckets.mins40Plus++;
      if (mins >= 60) buckets.mins60Plus++;
    }
  }

  return buckets;
}
