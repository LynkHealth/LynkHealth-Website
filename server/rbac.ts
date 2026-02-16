/**
 * Role-Based Access Control (HIPAA 164.312(a)(1) -- Access Control)
 *
 * Implements the principle of minimum necessary access.
 * Six roles: super_admin, admin, care_coordinator, enrollment_specialist, billing_specialist, practice_admin.
 * Supports per-user permission overrides for cherry-pickable access.
 */

import type { Request, Response, NextFunction } from "express";
import { writeAuditLog, auditFromRequest, AuditAction } from "./audit";
import { db } from "./db";
import { userPermissions } from "@shared/schema";
import { eq } from "drizzle-orm";

export enum Permission {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  VIEW_PRACTICES = "VIEW_PRACTICES",
  VIEW_SNAPSHOTS = "VIEW_SNAPSHOTS",

  VIEW_INQUIRIES = "VIEW_INQUIRIES",
  VIEW_REFERRALS = "VIEW_REFERRALS",
  VIEW_TC_SAMPLES = "VIEW_TC_SAMPLES",

  TRIGGER_SYNC = "TRIGGER_SYNC",
  MANAGE_PRACTICES = "MANAGE_PRACTICES",

  // Ambient AI -- Call recordings & SOAP notes
  VIEW_CALLS = "VIEW_CALLS",
  MANAGE_CALLS = "MANAGE_CALLS",
  VIEW_TIME_ENTRIES = "VIEW_TIME_ENTRIES",
  MANAGE_TIME_ENTRIES = "MANAGE_TIME_ENTRIES",

  VIEW_AUDIT_LOGS = "VIEW_AUDIT_LOGS",
  MANAGE_USERS = "MANAGE_USERS",

  VIEW_PATIENTS = "VIEW_PATIENTS",
  MANAGE_PATIENTS = "MANAGE_PATIENTS",
  VIEW_CLINICAL = "VIEW_CLINICAL",
  MANAGE_CLINICAL = "MANAGE_CLINICAL",

  VIEW_BILLING = "VIEW_BILLING",
  MANAGE_BILLING = "MANAGE_BILLING",
  VIEW_INVOICES = "VIEW_INVOICES",
  MANAGE_INVOICES = "MANAGE_INVOICES",
  VIEW_ERA_EOB = "VIEW_ERA_EOB",
  MANAGE_ERA_EOB = "MANAGE_ERA_EOB",
  VIEW_REVENUE = "VIEW_REVENUE",

  VIEW_ENROLLMENT = "VIEW_ENROLLMENT",
  MANAGE_ENROLLMENT = "MANAGE_ENROLLMENT",

  VIEW_SCHEDULE = "VIEW_SCHEDULE",
  MANAGE_SCHEDULE = "MANAGE_SCHEDULE",
  VIEW_TASKS = "VIEW_TASKS",
  MANAGE_TASKS = "MANAGE_TASKS",
  VIEW_TEMPLATES = "VIEW_TEMPLATES",
  MANAGE_TEMPLATES = "MANAGE_TEMPLATES",
  VIEW_FORMS = "VIEW_FORMS",
  MANAGE_FORMS = "MANAGE_FORMS",

  MANAGE_SUPER_ADMINS = "MANAGE_SUPER_ADMINS",
  DROP_IN_ANY_PRACTICE = "DROP_IN_ANY_PRACTICE",
  DROP_IN_ASSIGNED_PRACTICES = "DROP_IN_ASSIGNED_PRACTICES",
}

export const FINANCIAL_PERMISSIONS = [
  Permission.VIEW_BILLING,
  Permission.MANAGE_BILLING,
  Permission.VIEW_INVOICES,
  Permission.MANAGE_INVOICES,
  Permission.VIEW_ERA_EOB,
  Permission.MANAGE_ERA_EOB,
  Permission.VIEW_REVENUE,
];

const SHARED_CLINICAL_PERMS = [
  Permission.VIEW_DASHBOARD,
  Permission.VIEW_PRACTICES,
  Permission.VIEW_SNAPSHOTS,
  Permission.VIEW_PATIENTS,
  Permission.VIEW_CLINICAL,
  Permission.VIEW_SCHEDULE,
  Permission.VIEW_TASKS,
  Permission.VIEW_TEMPLATES,
  Permission.VIEW_FORMS,
];

const ROLE_DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: Object.values(Permission),

  admin: Object.values(Permission).filter(
    p => !FINANCIAL_PERMISSIONS.includes(p) && p !== Permission.MANAGE_SUPER_ADMINS
  ),

  care_coordinator: [
    ...SHARED_CLINICAL_PERMS,
    Permission.MANAGE_PATIENTS,
    Permission.MANAGE_CLINICAL,
    Permission.MANAGE_SCHEDULE,
    Permission.MANAGE_TASKS,
    Permission.MANAGE_TEMPLATES,
    Permission.MANAGE_FORMS,
    Permission.VIEW_INQUIRIES,
    Permission.VIEW_REFERRALS,
    Permission.VIEW_TC_SAMPLES,
    Permission.VIEW_CALLS,
    Permission.MANAGE_CALLS,
    Permission.VIEW_TIME_ENTRIES,
    Permission.MANAGE_TIME_ENTRIES,
    Permission.VIEW_ENROLLMENT,
    Permission.DROP_IN_ASSIGNED_PRACTICES,
  ],

  enrollment_specialist: [
    ...SHARED_CLINICAL_PERMS,
    Permission.VIEW_ENROLLMENT,
    Permission.MANAGE_ENROLLMENT,
    Permission.MANAGE_PATIENTS,
    Permission.VIEW_INQUIRIES,
    Permission.DROP_IN_ASSIGNED_PRACTICES,
  ],

  billing_specialist: [
    ...SHARED_CLINICAL_PERMS,
    Permission.VIEW_BILLING,
    Permission.MANAGE_BILLING,
    Permission.VIEW_INVOICES,
    Permission.MANAGE_INVOICES,
    Permission.VIEW_ERA_EOB,
    Permission.MANAGE_ERA_EOB,
    Permission.VIEW_REVENUE,
    Permission.DROP_IN_ASSIGNED_PRACTICES,
  ],

  practice_admin: [
    ...SHARED_CLINICAL_PERMS,
    Permission.VIEW_INQUIRIES,
    Permission.VIEW_PATIENTS,
    Permission.MANAGE_PATIENTS,
    Permission.VIEW_CLINICAL,
    Permission.VIEW_ENROLLMENT,
    Permission.VIEW_BILLING,
    Permission.VIEW_INVOICES,
  ],
};

export function getRoleDefaultPermissions(role: string): Permission[] {
  return ROLE_DEFAULT_PERMISSIONS[role] || [];
}

export function getAllPermissions(): Permission[] {
  return Object.values(Permission);
}

export function getAssignablePermissions(): Permission[] {
  return Object.values(Permission).filter(
    p => p !== Permission.MANAGE_SUPER_ADMINS && p !== Permission.DROP_IN_ANY_PRACTICE
  );
}

const permissionCache = new Map<number, { permissions: Set<Permission>, timestamp: number }>();
const CACHE_TTL_MS = 30_000;

export async function getEffectivePermissions(userId: number, role: string): Promise<Set<Permission>> {
  const cached = permissionCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.permissions;
  }

  const defaults = new Set(getRoleDefaultPermissions(role));

  if (role === "super_admin") {
    permissionCache.set(userId, { permissions: defaults, timestamp: Date.now() });
    return defaults;
  }

  const overrides = await db.select().from(userPermissions).where(eq(userPermissions.userId, userId));

  const effective = new Set(defaults);
  for (const override of overrides) {
    const perm = override.permission as Permission;
    if (override.allowed === 1) {
      effective.add(perm);
    } else {
      effective.delete(perm);
    }
  }

  permissionCache.set(userId, { permissions: effective, timestamp: Date.now() });
  return effective;
}

export function clearPermissionCache(userId?: number) {
  if (userId) {
    permissionCache.delete(userId);
  } else {
    permissionCache.clear();
  }
}

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_DEFAULT_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function requirePermission(permission: Permission) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const adminUser = (req as any).adminUser;
    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const effective = await getEffectivePermissions(adminUser.id, adminUser.role);

    if (!effective.has(permission)) {
      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PERMISSION_DENIED,
        resourceType: "permission",
        resourceId: permission,
        outcome: "failure",
        details: {
          requiredPermission: permission,
          userRole: adminUser.role,
          path: req.path,
          method: req.method,
        },
      }));

      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const adminUser = (req as any).adminUser;
    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const effective = await getEffectivePermissions(adminUser.id, adminUser.role);

    if (!permissions.some(p => effective.has(p))) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
}
