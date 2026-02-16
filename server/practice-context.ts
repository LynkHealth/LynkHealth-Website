import type { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { userPracticeAssignments, adminSessions } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { writeAuditLog, auditFromRequest, AuditAction } from "./audit";
import { Permission, getEffectivePermissions } from "./rbac";

export async function getUserPracticeIds(userId: number): Promise<number[]> {
  const assignments = await db
    .select({ practiceId: userPracticeAssignments.practiceId })
    .from(userPracticeAssignments)
    .where(eq(userPracticeAssignments.userId, userId));
  return assignments.map(a => a.practiceId);
}

export async function isUserAssignedToPractice(userId: number, practiceId: number): Promise<boolean> {
  const assignment = await db
    .select()
    .from(userPracticeAssignments)
    .where(
      and(
        eq(userPracticeAssignments.userId, userId),
        eq(userPracticeAssignments.practiceId, practiceId)
      )
    )
    .limit(1);
  return assignment.length > 0;
}

export async function setActivePractice(sessionToken: string, practiceId: number | null): Promise<void> {
  await db
    .update(adminSessions)
    .set({ activePracticeId: practiceId })
    .where(eq(adminSessions.token, sessionToken));
}

export function practiceContext(options?: { required?: boolean }) {
  const required = options?.required ?? false;

  return async (req: Request, res: Response, next: NextFunction) => {
    const adminUser = (req as any).adminUser;
    const session = (req as any).adminSession;
    if (!adminUser) return next();

    const role = adminUser.role;
    let activePracticeId: number | null = session?.activePracticeId || null;

    if (role === "super_admin") {
      (req as any).practiceId = activePracticeId;
      (req as any).allPracticeAccess = true;
      return next();
    }

    if (role === "admin") {
      (req as any).practiceId = activePracticeId;
      (req as any).allPracticeAccess = true;
      return next();
    }

    const assignedPracticeIds = await getUserPracticeIds(adminUser.id);
    (req as any).assignedPracticeIds = assignedPracticeIds;

    if (role === "practice_admin") {
      if (assignedPracticeIds.length === 0) {
        if (required) {
          return res.status(403).json({ success: false, message: "No practice assigned" });
        }
        (req as any).practiceId = null;
        return next();
      }
      (req as any).practiceId = assignedPracticeIds[0];
      (req as any).allPracticeAccess = false;
      return next();
    }

    const effective = await getEffectivePermissions(adminUser.id, role);
    const canDropIn = effective.has(Permission.DROP_IN_ASSIGNED_PRACTICES);

    if (activePracticeId && canDropIn) {
      if (!assignedPracticeIds.includes(activePracticeId)) {
        (req as any).practiceId = assignedPracticeIds[0] || null;
      } else {
        (req as any).practiceId = activePracticeId;
      }
    } else {
      (req as any).practiceId = assignedPracticeIds[0] || null;
    }

    (req as any).allPracticeAccess = false;
    next();
  };
}

export function requirePracticeAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const adminUser = (req as any).adminUser;
    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const practiceId = (req as any).practiceId;
    const allPracticeAccess = (req as any).allPracticeAccess;

    if (allPracticeAccess) return next();

    if (!practiceId) {
      return res.status(403).json({ success: false, message: "No practice context" });
    }

    next();
  };
}
