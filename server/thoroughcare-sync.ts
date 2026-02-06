import {
  fetchOrganizations,
  fetchEnrollments,
  fetchTasksForPeriod,
  fetchPatientCount,
  testConnection,
} from "./thoroughcare-client";
import { db } from "./db";
import { practices, programSnapshots, tcSyncLog } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

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
    await syncOrganizations();

    updateProgress("Enrollments", 20, "Fetching enrollment data...");
    const enrollmentData = await syncEnrollments();

    updateProgress("Time Logs", 50, `Fetching time logs for ${targetMonth} ${targetYear}...`);
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

async function syncOrganizations() {
  const orgs = await fetchOrganizations();

  for (const org of orgs) {
    const tcId = org.id;
    const name = org.name || "Unknown";
    const alias = org.alias || null;
    const active = org.active !== false;

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
    } else {
      await db.insert(practices).values({
        name,
        thoroughcareId: tcId,
        thoroughcareAlias: alias,
        status: active ? "active" : "inactive",
        departments: deptNames.length > 0 ? JSON.stringify(deptNames) : null,
      });
    }
  }

  updateProgress("Organizations", 15, `Synced ${orgs.length} practices`);
}

interface EnrollmentData {
  totalEnrollments: number;
  byPractice: Map<number, Map<string, { active: number; inactive: number; total: number }>>;
  patientOrgs: Map<string, number>;
}

async function syncEnrollments(): Promise<EnrollmentData> {
  const enrollments = await fetchEnrollments((page, total) => {
    const pct = Math.min(20 + Math.round((page / total) * 25), 45);
    updateProgress("Enrollments", pct, `Fetching enrollments page ${page}/${total}...`);
  });

  const patientOrgs = new Map<string, number>();
  const byPractice = new Map<number, Map<string, { active: number; inactive: number; total: number }>>();

  for (const enrollment of enrollments) {
    const patientRef = enrollment.patient?.reference;
    const programCode = enrollment.type?.coding?.[0]?.code;
    const status = enrollment.status?.toLowerCase();
    const careManagerRef = enrollment.careManager?.reference;

    if (!programCode) continue;

    const patientId = patientRef?.replace("Patient/", "");

    const practitionerMatch = careManagerRef?.match(/Practitioner\/(\d+)/);
    let orgId: number | undefined;

    if (patientId && patientOrgs.has(patientId)) {
      orgId = patientOrgs.get(patientId);
    }

    if (!orgId) {
      orgId = 0;
    }

    if (!byPractice.has(orgId)) {
      byPractice.set(orgId, new Map());
    }
    const programs = byPractice.get(orgId)!;
    if (!programs.has(programCode)) {
      programs.set(programCode, { active: 0, inactive: 0, total: 0 });
    }
    const stats = programs.get(programCode)!;
    stats.total++;
    if (status === "active") {
      stats.active++;
    } else {
      stats.inactive++;
    }
  }

  updateProgress("Enrollments", 45, `Processed ${enrollments.length} enrollments`);
  return { totalEnrollments: enrollments.length, byPractice, patientOrgs };
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
      const pct = Math.min(50 + Math.round((page / total) * 25), 75);
      updateProgress("Time Logs", pct, `Fetching time logs page ${page}/${total}...`);
    });
  } catch (error) {
    console.error("[TC Sync] Error fetching tasks:", error);
    tasks = [];
  }

  const patientMinutes = new Map<string, Map<string, number>>();

  for (const task of tasks) {
    const patientRef = task.for?.reference;
    const programCode = task.code?.coding?.[0]?.code;
    const description = task.description || "";

    if (!patientRef || !programCode) continue;

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

    const key = `${patientId}`;
    if (!patientMinutes.has(key)) {
      patientMinutes.set(key, new Map());
    }
    const programMins = patientMinutes.get(key)!;
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
  const practiceMap = new Map(allPractices.map((p) => [p.thoroughcareId || 0, p]));

  await db.delete(programSnapshots)
    .where(and(eq(programSnapshots.month, month), eq(programSnapshots.year, year)));

  const programTypes = ["CCM", "PCM", "AWV", "BHI", "RPM", "RTM"];

  const allEnrollmentsByProgram = new Map<string, { active: number; inactive: number; total: number }>();

  enrollmentData.byPractice.forEach((programs, _orgId) => {
    programs.forEach((stats, program) => {
      if (!allEnrollmentsByProgram.has(program)) {
        allEnrollmentsByProgram.set(program, { active: 0, inactive: 0, total: 0 });
      }
      const agg = allEnrollmentsByProgram.get(program)!;
      agg.active += stats.active;
      agg.inactive += stats.inactive;
      agg.total += stats.total;
    });
  });

  const minutesByProgram = new Map<string, number[]>();
  timeData.patientMinutes.forEach((programs, patientId) => {
    programs.forEach((mins, program) => {
      if (!minutesByProgram.has(program)) {
        minutesByProgram.set(program, []);
      }
      minutesByProgram.get(program)!.push(mins);
    });
  });

  for (const practice of allPractices) {
    for (const programType of programTypes) {
      const enrollment = allEnrollmentsByProgram.get(programType);
      if (!enrollment && !minutesByProgram.has(programType)) continue;

      const patientMinutesList = minutesByProgram.get(programType) || [];

      const timeBuckets = categorizeMinutes(programType, patientMinutesList);
      const patientsEnrolled = enrollment?.active || 0;
      const inactive = enrollment?.inactive || 0;

      if (patientsEnrolled === 0 && inactive === 0 && patientMinutesList.length === 0) continue;

      const isGlobalPractice = practice.id === allPractices[0]?.id;
      if (!isGlobalPractice) continue;

      await db.insert(programSnapshots).values({
        practiceId: practice.id,
        programType,
        month,
        year,
        patientsEnrolled,
        notEnrolled: 0,
        inactive,
        source: "thoroughcare",
        syncedAt: new Date(),
        ...timeBuckets,
      });
    }
  }

  updateProgress("Snapshots", 95, `Built program snapshots for ${month} ${year}`);
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

export async function getLastSync(): Promise<TcSyncLog | null> {
  const [last] = await db.select().from(tcSyncLog).orderBy(tcSyncLog.id).limit(1);
  return last || null;
}

type TcSyncLog = typeof tcSyncLog.$inferSelect;
