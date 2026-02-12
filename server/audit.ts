/**
 * HIPAA Audit Logging System (164.312(b) -- Audit Controls)
 *
 * Provides append-only audit logging for all PHI/PII access,
 * authentication events, and administrative actions.
 *
 * Audit logs must be retained for 6 years per HIPAA requirements.
 * This module is fire-and-forget: audit failures never block requests.
 */

import type { Request } from "express";
import { db } from "./db";
import { auditLogs } from "@shared/schema";
import { desc, eq, and, gte, lte } from "drizzle-orm";

// Canonical list of auditable events
export enum AuditAction {
  // Authentication
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  SESSION_CREATED = "SESSION_CREATED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  INVALID_SESSION = "INVALID_SESSION",

  // PHI access (wound care referrals, patient data)
  PHI_CREATE = "PHI_CREATE",
  PHI_READ = "PHI_READ",
  PHI_UPDATE = "PHI_UPDATE",
  PHI_DELETE = "PHI_DELETE",
  PHI_EXPORT = "PHI_EXPORT",

  // PII access (contact inquiries, night coverage)
  PII_CREATE = "PII_CREATE",
  PII_READ = "PII_READ",

  // Admin actions
  ADMIN_USER_CREATED = "ADMIN_USER_CREATED",
  ADMIN_ROLE_CHANGED = "ADMIN_ROLE_CHANGED",
  ADMIN_PASSWORD_CHANGED = "ADMIN_PASSWORD_CHANGED",
  ADMIN_USER_DEACTIVATED = "ADMIN_USER_DEACTIVATED",
  PASSWORD_CHANGE_REQUIRED = "PASSWORD_CHANGE_REQUIRED",
  PASSWORD_RESET_REQUESTED = "PASSWORD_RESET_REQUESTED",
  PASSWORD_CHANGED = "PASSWORD_CHANGED",
  LOGIN_LOCKED = "LOGIN_LOCKED",

  // Data sync events
  TC_SYNC_STARTED = "TC_SYNC_STARTED",
  TC_SYNC_COMPLETED = "TC_SYNC_COMPLETED",
  TC_SYNC_FAILED = "TC_SYNC_FAILED",
  TC_DATA_FETCHED = "TC_DATA_FETCHED",

  // Session events
  SESSION_TIMEOUT = "SESSION_TIMEOUT",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",

  // Authorization events
  PERMISSION_DENIED = "PERMISSION_DENIED",

  // Practice management
  PRACTICE_CREATED = "PRACTICE_CREATED",
}

export interface AuditEntry {
  userId?: number;
  userEmail?: string;
  userRole?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  outcome?: "success" | "failure" | "error";
  phiAccessed?: boolean;
}

/**
 * Write an audit log entry. Fire-and-forget -- never throws.
 */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId ?? null,
      userEmail: entry.userEmail ?? null,
      userRole: entry.userRole ?? null,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId ?? null,
      ipAddress: entry.ipAddress ?? null,
      userAgent: entry.userAgent ?? null,
      details: entry.details ? JSON.stringify(entry.details) : null,
      outcome: entry.outcome ?? "success",
      phiAccessed: entry.phiAccessed ? 1 : 0,
    });
  } catch (err) {
    // Audit logging must never crash the application
    console.error("[AUDIT] Failed to write audit log:", err);
  }
}

/**
 * Create an audit entry pre-populated with request context.
 */
export function auditFromRequest(req: Request, entry: Omit<AuditEntry, "ipAddress" | "userAgent" | "userId" | "userEmail" | "userRole">): AuditEntry {
  const adminUser = (req as any).adminUser;
  return {
    userId: adminUser?.id,
    userEmail: adminUser?.email,
    userRole: adminUser?.role,
    ipAddress: getClientIp(req),
    userAgent: (req.headers["user-agent"] || "").substring(0, 500),
    ...entry,
  };
}

/**
 * Extract the real client IP, handling reverse proxies.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Query audit logs with filters. For superadmin audit log viewer.
 */
export async function getAuditLogs(filters: {
  userId?: number;
  action?: string;
  resourceType?: string;
  phiOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];

  if (filters.userId) {
    conditions.push(eq(auditLogs.userId, filters.userId));
  }
  if (filters.action) {
    conditions.push(eq(auditLogs.action, filters.action));
  }
  if (filters.resourceType) {
    conditions.push(eq(auditLogs.resourceType, filters.resourceType));
  }
  if (filters.phiOnly) {
    conditions.push(eq(auditLogs.phiAccessed, 1));
  }
  if (filters.startDate) {
    conditions.push(gte(auditLogs.timestamp, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(auditLogs.timestamp, filters.endDate));
  }

  const limit = Math.min(filters.limit || 100, 500);
  const offset = filters.offset || 0;

  let query = db.select().from(auditLogs);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await (query as any)
    .orderBy(desc(auditLogs.timestamp))
    .limit(limit)
    .offset(offset);
}
