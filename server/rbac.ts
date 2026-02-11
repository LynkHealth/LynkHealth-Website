/**
 * Role-Based Access Control (HIPAA 164.312(a)(1) -- Access Control)
 *
 * Implements the principle of minimum necessary access.
 * Three roles: viewer, admin, superadmin.
 */

import type { Request, Response, NextFunction } from "express";
import { writeAuditLog, auditFromRequest, AuditAction } from "./audit";

export enum Permission {
  // Dashboard & read-only data
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  VIEW_PRACTICES = "VIEW_PRACTICES",
  VIEW_SNAPSHOTS = "VIEW_SNAPSHOTS",

  // PII/PHI access (requires higher privilege)
  VIEW_INQUIRIES = "VIEW_INQUIRIES",       // PII: contact & night coverage
  VIEW_REFERRALS = "VIEW_REFERRALS",       // PHI: wound care referrals
  VIEW_TC_SAMPLES = "VIEW_TC_SAMPLES",     // PHI: ThoroughCare patient data

  // Operational actions
  TRIGGER_SYNC = "TRIGGER_SYNC",
  MANAGE_PRACTICES = "MANAGE_PRACTICES",

  // Admin-only
  VIEW_AUDIT_LOGS = "VIEW_AUDIT_LOGS",
  MANAGE_USERS = "MANAGE_USERS",
}

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  viewer: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PRACTICES,
    Permission.VIEW_SNAPSHOTS,
  ],
  admin: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PRACTICES,
    Permission.VIEW_SNAPSHOTS,
    Permission.VIEW_INQUIRIES,
    Permission.VIEW_REFERRALS,
    Permission.TRIGGER_SYNC,
    Permission.MANAGE_PRACTICES,
    Permission.VIEW_TC_SAMPLES,
  ],
  superadmin: Object.values(Permission),
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Express middleware that enforces a permission.
 * Must be used AFTER adminAuth middleware.
 */
export function requirePermission(permission: Permission) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const adminUser = (req as any).adminUser;
    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!hasPermission(adminUser.role, permission)) {
      // Audit the permission denial
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
