import {
  fetchOrganizations,
  fetchEnrollments,
  fetchTasksForPeriod,
  fetchPatientsForOrg,
  fetchCarePlansForPatientsBatch,
} from "./thoroughcare-client";
import { db } from "./db";
import { practices, programSnapshots, tcSyncLog } from "@shared/schema";
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
  inactivePatients: Set<string>;
}

async function buildPatientOrgMap(tcOrgIds: number[]): Promise<PatientData> {
  const orgMap = new Map<string, number>();
  const inactivePatients = new Set<string>();

  for (let i = 0; i < tcOrgIds.length; i++) {
    const orgId = tcOrgIds[i];
    updateProgress("Patients", 10 + Math.round((i / tcOrgIds.length) * 8), `Fetching patients for org ${i + 1}/${tcOrgIds.length}...`);

    try {
      const patients = await fetchPatientsForOrg(orgId);
      for (const patient of patients) {
        const patientId = String(patient.id);
        orgMap.set(patientId, orgId);
        const flags = patient.extension?.find((e: any) => e.url === "flags")?.value || [];
        if (flags.includes("INACTIVE")) {
          inactivePatients.add(patientId);
        }
      }
    } catch (err) {
      console.error(`[TC Sync] Error fetching patients for org ${orgId}:`, err);
    }
  }

  updateProgress("Patients", 18, `Mapped ${orgMap.size} patients to ${tcOrgIds.length} organizations (${inactivePatients.size} inactive)`);
  return { orgMap, inactivePatients };
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
}

async function syncEnrollments(patientData: PatientData): Promise<EnrollmentData> {
  const { orgMap, inactivePatients } = patientData;

  const enrollments = await fetchEnrollments((page, total) => {
    const pct = Math.min(20 + Math.round((page / total) * 18), 38);
    updateProgress("Enrollments", pct, `Fetching enrollments page ${page}/${total}...`);
  });

  const byOrg = new Map<number, Map<string, ProgramStats>>();

  for (const enrollment of enrollments) {
    const patientRef = enrollment.patient?.reference;
    let programCode = enrollment.type?.coding?.[0]?.code;

    if (!programCode || !patientRef) continue;

    programCode = programCode.toUpperCase();

    const patientId = patientRef.replace("Patient/", "");
    const tcOrgId = orgMap.get(patientId) || 0;

    if (!byOrg.has(tcOrgId)) {
      byOrg.set(tcOrgId, new Map());
    }
    const programs = byOrg.get(tcOrgId)!;
    if (!programs.has(programCode)) {
      programs.set(programCode, { active: 0, inactive: 0, total: 0, activePatientIds: new Set() });
    }
    const stats = programs.get(programCode)!;
    stats.total++;

    const isActive = enrollment.status?.toLowerCase() === "active";
    const isPatientInactive = inactivePatients.has(patientId);

    if (isActive && !isPatientInactive) {
      stats.active++;
      stats.activePatientIds.add(patientId);
    } else {
      stats.inactive++;
    }
  }

  let orgSummary = "";
  byOrg.forEach((programs, orgId) => {
    let total = 0;
    programs.forEach((stats) => { total += stats.activePatientIds.size; });
    if (total > 0) orgSummary += `org${orgId}:${total} `;
  });

  updateProgress("Enrollments", 38, `Processed ${enrollments.length} enrollments (${orgSummary.trim()})`);
  return { totalEnrollments: enrollments.length, byOrg };
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
  for (let oi = 0; oi < orgEntries.length; oi++) {
    const [tcOrgId, programs] = orgEntries[oi];
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

      const patientsEnrolled = enrollment.activePatientIds.size;
      const inactive = enrollment.inactive;
      const notEnrolled = 0;

      const patientMinutesList: number[] = [];
      let patientsWithTime = 0;

      const patientIds = Array.from(enrollment.activePatientIds);
      for (const patientId of patientIds) {
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

      await db.insert(programSnapshots).values({
        practiceId: dbPracticeId,
        programType,
        month,
        year,
        patientsEnrolled,
        notEnrolled,
        inactive,
        source: "thoroughcare",
        syncedAt: new Date(),
        ...timeBuckets,
      });
    }
  }

  updateProgress("Snapshots", 95, `Built per-practice program snapshots for ${month} ${year}`);
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
