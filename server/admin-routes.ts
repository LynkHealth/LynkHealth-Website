import type { Express, Request, Response, NextFunction } from "express";
// @ts-ignore - No type definitions available
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { adminLoginSchema, changePasswordSchema, adminPasswordSchema, cptBillingCodes, staffRoleOverrides, tcStaffTimeLogs, programSnapshots, practices, eraUploads, eraLineItems } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { runFullSync, runHistoricalSync, runRevenueSync, runHistoricalRevenueSync, getSyncStatus } from "./thoroughcare-sync";
import { testConnection } from "./thoroughcare-client";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import multer from "multer";
import { parse835, mapCptToProgram } from "./era-parser";
import { writeAuditLog, auditFromRequest, getAuditLogs, AuditAction, getClientIp } from "./audit";
import { requirePermission, requireAnyPermission, Permission, hasPermission, getEffectivePermissions, clearPermissionCache, getRoleDefaultPermissions, getAllPermissions, getAssignablePermissions } from "./rbac";
import { sendEmail, buildPasswordResetEmail } from "./email";
import { getUserPracticeIds, setActivePractice, practiceContext, isUserAssignedToPractice } from "./practice-context";
import { userPracticeAssignments, userPermissions } from "@shared/schema";
import { transcribeAudio, transcribeManual, isTranscriptionConfigured } from "./transcription-service";
import { generateSoapNote, createBlankSoapNote, isSoapGenerationConfigured } from "./soap-generator";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const MAX_SESSION_LIFETIME_MS = 4 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 30;
const PASSWORD_HISTORY_COUNT = 5;
const PASSWORD_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
  validate: { xForwardedForHeader: false, ip: false },
});

declare global {
  namespace Express {
    interface Request {
      adminUser?: { id: number; email: string; name: string; role: string };
    }
  }
}

function setSessionCookie(res: Response, token: string) {
  res.cookie("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: INACTIVITY_TIMEOUT_MS,
    path: "/",
  });
}

function clearSessionCookie(res: Response) {
  res.clearCookie("admin_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_session || req.headers.authorization?.replace("Bearer ", "") || req.cookies?.admin_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const session = await storage.getAdminSession(token);
  if (!session) {
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session expired" });
  }

  const now = new Date();

  if (now > new Date(session.expiresAt)) {
    await storage.deleteAdminSession(token);
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session expired" });
  }

  if (session.lastActivity) {
    const inactiveSince = now.getTime() - new Date(session.lastActivity).getTime();
    if (inactiveSince > INACTIVITY_TIMEOUT_MS) {
      await storage.deleteAdminSession(token);
      await writeAuditLog({
        action: AuditAction.SESSION_TIMEOUT,
        userId: session.userId,
        resourceType: "session",
        ipAddress: getClientIp(req),
        userAgent: (req.headers["user-agent"] || "").substring(0, 500),
        outcome: "success",
      });
      clearSessionCookie(res);
      return res.status(401).json({ success: false, message: "Session timed out due to inactivity" });
    }
  }

  if (session.ipAddress && session.ipAddress !== getClientIp(req)) {
    await storage.deleteAdminSession(token);
    await writeAuditLog({
      action: AuditAction.INVALID_SESSION,
      userId: session.userId,
      resourceType: "session",
      ipAddress: getClientIp(req),
      userAgent: (req.headers["user-agent"] || "").substring(0, 500),
      outcome: "failure",
      details: { reason: "ip_mismatch" },
    });
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session invalid - IP address changed" });
  }

  const adminUser = await storage.getAdminUserById(session.userId);
  if (!adminUser) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  try {
    const { adminSessions: sessionsTable } = await import("@shared/schema");
    await db.update(sessionsTable)
      .set({ lastActivity: now })
      .where(eq(sessionsTable.token, token));
  } catch (e) {}

  setSessionCookie(res, token);

  (req as any).adminSession = session;
  req.adminUser = { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: adminUser.role };
  next();
}

export function requireRole(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const userRole = req.adminUser?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
}

export async function registerAdminRoutes(app: Express) {
  app.post("/api/admin/login", loginRateLimit, async (req, res) => {
    try {
      const { email, password } = adminLoginSchema.parse(req.body);
      const ipAddress = getClientIp(req);

      const recentFailures = await storage.getRecentFailedAttempts(email, LOCKOUT_WINDOW_MINUTES);
      if (recentFailures >= MAX_FAILED_ATTEMPTS) {
        await writeAuditLog({
          action: AuditAction.LOGIN_LOCKED,
          resourceType: "user",
          details: { email },
          ipAddress,
          userAgent: (req.headers["user-agent"] || "").substring(0, 500),
          outcome: "failure",
        });
        return res.status(429).json({ success: false, message: "Account temporarily locked. Please try again later." });
      }

      const user = await storage.getAdminUserByEmail(email);
      if (!user) {
        await storage.recordLoginAttempt(email, ipAddress, false, "user_not_found");
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      if (user.status === "inactive") {
        return res.status(403).json({ success: false, message: "This account has been deactivated. Contact your administrator." });
      }

      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        return res.status(429).json({ success: false, message: "Account temporarily locked. Please try again later." });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        await storage.recordLoginAttempt(email, ipAddress, false, "invalid_password");
        await writeAuditLog({
          action: AuditAction.LOGIN_FAILURE,
          userId: user.id,
          resourceType: "user",
          details: { reason: "invalid_password" },
          ipAddress,
          userAgent: (req.headers["user-agent"] || "").substring(0, 500),
          outcome: "failure",
        });
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      await storage.recordLoginAttempt(email, ipAddress, true);

      const needsPasswordChange = user.mustChangePassword === 1 ||
        (user.lastPasswordChange && (Date.now() - new Date(user.lastPasswordChange).getTime() > PASSWORD_MAX_AGE_MS)) ||
        !user.lastPasswordChange;

      if (needsPasswordChange) {
        await storage.deleteUserSessions(user.id);
        const token = crypto.randomBytes(48).toString("hex");
        const expiresAt = new Date(Date.now() + MAX_SESSION_LIFETIME_MS);
        await storage.createAdminSession(user.id, token, expiresAt, ipAddress);
        setSessionCookie(res, token);
        return res.json({
          success: true,
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
          mustChangePassword: true,
        });
      }

      await storage.deleteUserSessions(user.id);
      const token = crypto.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + MAX_SESSION_LIFETIME_MS);
      await storage.createAdminSession(user.id, token, expiresAt, ipAddress);

      await writeAuditLog({
        action: AuditAction.LOGIN_SUCCESS,
        userId: user.id,
        resourceType: "user",
        ipAddress,
        userAgent: (req.headers["user-agent"] || "").substring(0, 500),
        outcome: "success",
      });

      setSessionCookie(res, token);

      const practiceIds = await getUserPracticeIds(user.id);
      const effectivePerms = await getEffectivePermissions(user.id, user.role);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          assignedPracticeIds: practiceIds,
          permissions: Array.from(effectivePerms),
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid login data", errors: error.errors });
      }
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", adminAuth, async (req, res) => {
    const token = req.cookies?.admin_session || req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      await storage.deleteAdminSession(token);
    }
    await writeAuditLog({
      action: AuditAction.LOGOUT,
      userId: req.adminUser?.id,
      resourceType: "user",
      ipAddress: getClientIp(req),
      userAgent: (req.headers["user-agent"] || "").substring(0, 500),
      outcome: "success",
    });
    clearSessionCookie(res);
    res.json({ success: true });
  });

  app.get("/api/admin/me", adminAuth, async (req, res) => {
    try {
      const user = req.adminUser!;
      const practiceIds = await getUserPracticeIds(user.id);
      const effectivePerms = await getEffectivePermissions(user.id, user.role);
      const session = (req as any).adminSession;
      res.json({
        success: true,
        user: {
          ...user,
          assignedPracticeIds: practiceIds,
          permissions: Array.from(effectivePerms),
          activePracticeId: session?.activePracticeId || null,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get user info" });
    }
  });

  app.post("/api/admin/switch-practice", adminAuth, async (req, res) => {
    try {
      const { practiceId } = z.object({ practiceId: z.number().nullable() }).parse(req.body);
      const user = req.adminUser!;
      const role = user.role;

      if (role === "practice_admin") {
        return res.status(403).json({ success: false, message: "Practice admins cannot switch practices" });
      }

      if (practiceId !== null) {
        if (role === "super_admin" || role === "admin") {
          // can access any practice
        } else {
          const assigned = await isUserAssignedToPractice(user.id, practiceId);
          if (!assigned) {
            return res.status(403).json({ success: false, message: "Not assigned to this practice" });
          }
        }
      }

      const token = req.cookies?.admin_session || req.headers.authorization?.replace("Bearer ", "");
      if (token) {
        await setActivePractice(token, practiceId);
      }

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PHI_READ,
        resourceType: "practice_switch",
        resourceId: practiceId?.toString() || "all",
        outcome: "success",
        details: { switchedToPracticeId: practiceId },
      }));

      res.json({ success: true, activePracticeId: practiceId });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to switch practice" });
    }
  });

  app.get("/api/admin/users/:id/practice-assignments", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const assignments = await db.select().from(userPracticeAssignments).where(eq(userPracticeAssignments.userId, userId));
      res.json({ success: true, assignments });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get practice assignments" });
    }
  });

  app.put("/api/admin/users/:id/practice-assignments", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      const assignmentsSchema = z.object({
        assignments: z.array(z.object({
          practiceId: z.number(),
          department: z.string().nullable().optional(),
        })),
      });
      const legacySchema = z.object({
        practiceIds: z.array(z.number()),
      });

      let assignments: { practiceId: number; department: string | null }[];
      const assignmentsParse = assignmentsSchema.safeParse(req.body);
      const legacyParse = legacySchema.safeParse(req.body);

      if (assignmentsParse.success) {
        assignments = assignmentsParse.data.assignments.map(a => ({
          practiceId: a.practiceId,
          department: a.department || null,
        }));
      } else if (legacyParse.success) {
        assignments = legacyParse.data.practiceIds.map(id => ({
          practiceId: id,
          department: null,
        }));
      } else {
        return res.status(400).json({ success: false, message: "Invalid request: provide assignments or practiceIds" });
      }

      await db.delete(userPracticeAssignments).where(eq(userPracticeAssignments.userId, userId));

      for (const assignment of assignments) {
        await db.insert(userPracticeAssignments).values({
          userId,
          practiceId: assignment.practiceId,
          department: assignment.department,
        });
      }

      clearPermissionCache(userId);
      res.json({ success: true, assignments });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update practice assignments" });
    }
  });

  app.get("/api/admin/users/:id/permissions", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getAdminUserById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const overrides = await db.select().from(userPermissions).where(eq(userPermissions.userId, userId));
      const effective = await getEffectivePermissions(userId, user.role);
      const defaults = getRoleDefaultPermissions(user.role);

      res.json({
        success: true,
        roleDefaults: defaults,
        overrides: overrides.map(o => ({ permission: o.permission, allowed: o.allowed === 1 })),
        effective: Array.from(effective),
        allPermissions: getAllPermissions(),
        assignable: getAssignablePermissions(),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get user permissions" });
    }
  });

  app.put("/api/admin/users/:id/permissions", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getAdminUserById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (user.role === "super_admin") {
        return res.status(403).json({ success: false, message: "Cannot modify super admin permissions" });
      }

      const { permissions: permUpdates } = z.object({
        permissions: z.array(z.object({
          permission: z.string(),
          allowed: z.boolean(),
        })),
      }).parse(req.body);

      await db.delete(userPermissions).where(eq(userPermissions.userId, userId));

      for (const update of permUpdates) {
        await db.insert(userPermissions).values({
          userId,
          permission: update.permission,
          allowed: update.allowed ? 1 : 0,
        });
      }

      clearPermissionCache(userId);
      const effective = await getEffectivePermissions(userId, user.role);
      res.json({ success: true, effective: Array.from(effective) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update permissions" });
    }
  });

  app.get("/api/admin/roles", adminAuth, (req, res) => {
    const { USER_ROLES } = require("@shared/schema");
    res.json({
      success: true,
      roles: USER_ROLES,
      assignable: getAssignablePermissions(),
      allPermissions: getAllPermissions(),
    });
  });

  const forgotPasswordRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: "Too many reset requests. Please try again later." },
  });

  app.post("/api/admin/forgot-password", forgotPasswordRateLimit, async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const ipAddress = getClientIp(req);

      const user = await storage.getAdminUserByEmail(email);
      if (user) {
        await storage.invalidateUserResetTokens(user.id);
        const rawToken = crypto.randomBytes(48).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await storage.createPasswordResetToken(user.id, tokenHash, expiresAt);

        const protocol = req.headers["x-forwarded-proto"] || "https";
        const host = req.headers.host || "localhost:5000";
        const resetUrl = `${protocol}://${host}/admin/reset-password?token=${rawToken}`;

        const emailContent = buildPasswordResetEmail(resetUrl, user.name);
        emailContent.to = user.email;
        await sendEmail(emailContent);

        await writeAuditLog({
          action: AuditAction.PASSWORD_RESET_REQUESTED,
          userId: user.id,
          resourceType: "user",
          details: { email },
          ipAddress,
          userAgent: (req.headers["user-agent"] || "").substring(0, 500),
          outcome: "success",
        });
      }

      res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Please enter a valid email address." });
      }
      console.error("Forgot password error:", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });

  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = z.object({
        token: z.string().min(1),
        newPassword: z.string().min(12).regex(/[A-Z]/, "Must contain uppercase").regex(/[a-z]/, "Must contain lowercase").regex(/[0-9]/, "Must contain number").regex(/[^A-Za-z0-9]/, "Must contain special character"),
      }).parse(req.body);

      const ipAddress = getClientIp(req);
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const resetToken = await storage.getValidPasswordResetToken(tokenHash);

      if (!resetToken) {
        return res.status(400).json({ success: false, message: "This reset link has expired or already been used. Please request a new one." });
      }

      const user = await storage.getAdminUserById(resetToken.userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "Account not found." });
      }

      const previousPasswords = await storage.getPasswordHistory(user.id, 5);
      for (const prev of previousPasswords) {
        if (await bcrypt.compare(newPassword, prev.passwordHash)) {
          return res.status(400).json({ success: false, message: "Cannot reuse any of your last 5 passwords." });
        }
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await storage.updateAdminUser(user.id, {
        passwordHash: newHash,
        lastPasswordChange: new Date(),
        mustChangePassword: 0,
        failedLoginAttempts: 0,
        lockedUntil: null,
      });
      await storage.addPasswordHistory(user.id, newHash);
      await storage.markPasswordResetTokenUsed(resetToken.id);
      await storage.invalidateUserResetTokens(user.id);
      await storage.deleteUserSessions(user.id);

      await writeAuditLog({
        action: AuditAction.PASSWORD_CHANGED,
        userId: user.id,
        resourceType: "user",
        details: { method: "reset_link" },
        ipAddress,
        userAgent: (req.headers["user-agent"] || "").substring(0, 500),
        outcome: "success",
      });

      res.json({ success: true, message: "Password has been reset successfully. You can now sign in." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Password must be at least 12 characters with uppercase, lowercase, number, and special character." });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });

  app.get("/api/admin/me", adminAuth, async (req, res) => {
    res.json({ success: true, user: req.adminUser });
  });

  app.post("/api/admin/change-password", adminAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const user = await storage.getAdminUserById(req.adminUser!.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const validCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validCurrent) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }
      const history = await storage.getPasswordHistory(user.id, PASSWORD_HISTORY_COUNT);
      for (const entry of history) {
        if (await bcrypt.compare(newPassword, entry.passwordHash)) {
          return res.status(400).json({ success: false, message: `Cannot reuse the last ${PASSWORD_HISTORY_COUNT} passwords` });
        }
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      await storage.addPasswordHistory(user.id, user.passwordHash);
      await storage.updateAdminUser(user.id, {
        passwordHash: newHash,
        lastPasswordChange: new Date(),
      });
      await storage.deleteUserSessions(user.id);
      const newToken = crypto.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + MAX_SESSION_LIFETIME_MS);
      await storage.createAdminSession(user.id, newToken, expiresAt, getClientIp(req));
      setSessionCookie(res, newToken);
      await writeAuditLog({
        action: AuditAction.PASSWORD_CHANGE,
        userId: user.id,
        resourceType: "user",
        ipAddress: getClientIp(req),
        userAgent: (req.headers["user-agent"] || "").substring(0, 500),
        outcome: "success",
      });
      res.json({ success: true, token: newToken, message: "Password changed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid password data", errors: error.errors });
      }
      console.error("Change password error:", error);
      res.status(500).json({ success: false, message: "Failed to change password" });
    }
  });

  app.get("/api/admin/audit-logs", adminAuth, requirePermission(Permission.VIEW_AUDIT_LOGS), async (req, res) => {
    try {
      const { action, userId, startDate, endDate, limit, offset } = req.query;
      const logs = await getAuditLogs({
        action: action as string,
        userId: userId ? Number(userId) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? Number(limit) : 100,
        offset: offset ? Number(offset) : 0,
      });
      res.json({ success: true, logs });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/admin/dashboard", adminAuth, requirePermission(Permission.VIEW_DASHBOARD), async (req, res) => {
    try {
      const now = new Date();
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = req.query.month as string || monthNames[now.getMonth()];
      const year = parseInt(req.query.year as string) || now.getFullYear();
      const snapshots = await storage.getAggregatedSnapshots(month, year);
      const practicesList = await storage.getPractices();
      const inquiries = await storage.getContactInquiries();

      const departmentsByPractice: Record<number, string[]> = {};
      for (const s of snapshots) {
        if (s.department) {
          if (!departmentsByPractice[s.practiceId]) {
            departmentsByPractice[s.practiceId] = [];
          }
          if (!departmentsByPractice[s.practiceId].includes(s.department)) {
            departmentsByPractice[s.practiceId].push(s.department);
          }
        }
      }
      for (const key of Object.keys(departmentsByPractice)) {
        departmentsByPractice[Number(key)].sort();
      }

      const revenueData = await storage.getRevenueSnapshots(month, year);
      const revenueByCodeData = await storage.getRevenueByCode(month, year);
      const billingCodes = await storage.getCptBillingCodes(year);
      const codeDescriptions: Record<string, string> = {};
      for (const bc of billingCodes) {
        const desc = bc.description.replace(/^[A-Z]+ - /, '');
        codeDescriptions[bc.code] = desc;
      }
      res.json({ success: true, snapshots, practices: practicesList, departmentsByPractice, inquiries, month, year, revenue: revenueData, revenueByCode: revenueByCodeData, codeDescriptions });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ success: false, message: "Failed to load dashboard" });
    }
  });

  app.get("/api/admin/practices", adminAuth, requirePermission(Permission.VIEW_PRACTICES), async (req, res) => {
    try {
      const practices = await storage.getPractices();
      res.json({ success: true, practices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load practices" });
    }
  });

  app.post("/api/admin/practices", adminAuth, requirePermission(Permission.MANAGE_PRACTICES), async (req, res) => {
    try {
      const practiceSchema = z.object({
        name: z.string().min(1),
        thoroughcareId: z.number().optional(),
        npi: z.string().optional(),
        location: z.string().optional(),
        status: z.string().default("active"),
      });
      const validated = practiceSchema.parse(req.body);
      const practice = await storage.createPractice(validated);
      res.json({ success: true, practice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid practice data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to create practice" });
    }
  });

  app.get("/api/admin/snapshots", adminAuth, requirePermission(Permission.VIEW_SNAPSHOTS), async (req, res) => {
    try {
      const { practiceId, programType, month, year } = req.query;
      const snapshots = await storage.getProgramSnapshots(
        practiceId ? parseInt(practiceId as string) : undefined,
        programType as string | undefined,
        month as string | undefined,
        year ? parseInt(year as string) : undefined
      );
      res.json({ success: true, snapshots });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load snapshots" });
    }
  });

  app.get("/api/admin/inquiries", adminAuth, requirePermission(Permission.VIEW_INQUIRIES), async (req, res) => {
    try {
      const contactInquiries = await storage.getContactInquiries();
      const nightInquiries = await storage.getNightCoverageInquiries();
      const canViewReferrals = hasPermission(req.adminUser!.role, Permission.VIEW_REFERRALS);
      const woundReferrals = canViewReferrals ? await storage.getWoundCareReferrals() : [];
      res.json({ success: true, contactInquiries, nightInquiries, woundReferrals });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load inquiries" });
    }
  });

  app.get("/api/admin/tc/status", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (_req, res) => {
    try {
      const syncStatus = getSyncStatus();
      res.json({ success: true, ...syncStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get sync status" });
    }
  });

  app.post("/api/admin/tc/sync", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (req, res) => {
    try {
      const { month, year } = req.body || {};
      res.json({ success: true, message: "Sync started" });
      runFullSync(month, year).catch((err) => {
        console.error("[TC Sync] Background sync error:", err);
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start sync" });
    }
  });

  app.post("/api/admin/tc/sync-historical", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (req, res) => {
    try {
      const { months } = req.body || {};
      const totalMonths = Math.min(Math.max(months || 24, 1), 36);
      res.json({ success: true, message: `Historical sync started (${totalMonths} months)` });
      runHistoricalSync(totalMonths).catch((err) => {
        console.error("[TC Historical Sync] Background sync error:", err);
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start historical sync" });
    }
  });

  app.post("/api/admin/tc/sync-revenue", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (req, res) => {
    try {
      const { month, year } = req.body || {};
      res.json({ success: true, message: "Revenue sync started" });
      runRevenueSync(month, year).catch((err) => {
        console.error("[TC Revenue Sync] Background error:", err);
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start revenue sync" });
    }
  });

  app.post("/api/admin/tc/sync-revenue-historical", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (req, res) => {
    try {
      const { months } = req.body || {};
      const totalMonths = Math.min(Math.max(months || 24, 1), 36);
      res.json({ success: true, message: `Historical revenue sync started (${totalMonths} months)` });
      runHistoricalRevenueSync(totalMonths).catch((err) => {
        console.error("[TC Historical Revenue Sync] Background error:", err);
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start historical revenue sync" });
    }
  });

  app.get("/api/admin/tc/test", adminAuth, requirePermission(Permission.TRIGGER_SYNC), async (_req, res) => {
    try {
      const result = await testConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Connection test failed" });
    }
  });

  app.get("/api/admin/tc/sample-enrollments", adminAuth, requirePermission(Permission.VIEW_TC_SAMPLES), async (_req, res) => {
    try {
      const { fetchEnrollments } = await import("./thoroughcare-client");
      const enrollments = await fetchEnrollments(undefined, { _count: "10" });
      const samples = enrollments.slice(0, 10).map((e: any) => ({
        id: e.id,
        status: e.status,
        type: e.type,
        patient: e.patient,
        period: e.period,
        managingOrganization: e.managingOrganization,
        allKeys: Object.keys(e),
      }));
      res.json({ success: true, samples });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/billing-codes", adminAuth, async (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const codes = await storage.getCptBillingCodes(year);
      res.json({ success: true, codes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load billing codes" });
    }
  });

  app.post("/api/admin/billing-codes", adminAuth, async (req, res) => {
    try {
      const schema = z.object({
        code: z.string().min(1),
        description: z.string().min(1),
        program: z.string().min(1),
        rateCents: z.number().int().min(0),
        effectiveYear: z.number().int().min(2020).max(2050),
        state: z.string().default("MS"),
        isActive: z.number().default(1),
      });
      const validated = schema.parse(req.body);
      const billingCode = await storage.createCptBillingCode(validated);
      res.json({ success: true, code: billingCode });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid billing code data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to create billing code" });
    }
  });

  app.put("/api/admin/billing-codes/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schema = z.object({
        code: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        program: z.string().min(1).optional(),
        rateCents: z.number().int().min(0).optional(),
        effectiveYear: z.number().int().min(2020).max(2050).optional(),
        state: z.string().optional(),
        isActive: z.number().optional(),
      });
      const validated = schema.parse(req.body);
      const updated = await storage.updateCptBillingCode(id, validated);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Billing code not found" });
      }
      res.json({ success: true, code: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to update billing code" });
    }
  });

  app.delete("/api/admin/billing-codes/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCptBillingCode(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete billing code" });
    }
  });

  // ============================================================
  // Invoice Rate Routes
  // ============================================================

  app.get("/api/admin/invoice-rates/:practiceId/:year", adminAuth, async (req, res) => {
    try {
      const practiceId = parseInt(req.params.practiceId);
      const year = parseInt(req.params.year);
      const rates = await storage.initInvoiceRatesForPractice(practiceId, year);
      res.json({ success: true, rates });
    } catch (error) {
      console.error("Error loading invoice rates:", error);
      res.status(500).json({ success: false, message: "Failed to load invoice rates" });
    }
  });

  app.put("/api/admin/invoice-rates", adminAuth, async (req, res) => {
    try {
      const { practiceId, cptCode, program, description, claimRateCents, invoiceRateCents, effectiveYear } = req.body;
      if (!cptCode || !effectiveYear || !practiceId) {
        return res.status(400).json({ success: false, message: "Practice ID, CPT code and year are required" });
      }
      const updated = await storage.upsertInvoiceRate({
        practiceId,
        cptCode,
        program,
        description,
        claimRateCents,
        invoiceRateCents,
        effectiveYear,
      });
      res.json({ success: true, rate: updated });
    } catch (error) {
      console.error("Error updating invoice rate:", error);
      res.status(500).json({ success: false, message: "Failed to update invoice rate" });
    }
  });

  // ============================================================
  // Invoice Routes
  // ============================================================

  app.post("/api/admin/invoices/generate", adminAuth, async (req, res) => {
    try {
      const { month, year } = req.body;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "Month and year are required" });
      }
      const generated = await storage.generateInvoices(month, parseInt(year));
      res.json({ success: true, invoices: generated, count: generated.length });
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).json({ success: false, message: "Failed to generate invoices" });
    }
  });

  app.get("/api/admin/invoices", adminAuth, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const invoiceList = await storage.listInvoices(status, practiceId);
      res.json({ success: true, invoices: invoiceList });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to list invoices" });
    }
  });

  app.get("/api/admin/invoices/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }
      const lineItems = await storage.getInvoiceLineItems(id);
      res.json({ success: true, invoice, lineItems });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load invoice" });
    }
  });

  app.put("/api/admin/invoices/:id/status", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }
      const userId = req.adminUser?.id || 0;
      const updated = await storage.updateInvoiceStatus(id, status, userId, notes);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }
      res.json({ success: true, invoice: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update invoice status" });
    }
  });

  app.delete("/api/admin/invoices/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInvoice(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete invoice" });
    }
  });

  app.get("/api/admin/staffing", adminAuth, async (req, res) => {
    try {
      const month = req.query.month as string;
      const year = parseInt(req.query.year as string);
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const department = req.query.department as string | undefined;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "month and year are required" });
      }
      const data = await storage.getStaffingReport(month, year, practiceId, department);
      res.json({ success: true, data });
    } catch (error) {
      console.error("Staffing report error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch staffing report" });
    }
  });

  app.get("/api/admin/staff-revenue", adminAuth, async (req, res) => {
    try {
      const month = req.query.month as string;
      const year = parseInt(req.query.year as string);
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const department = req.query.department as string | undefined;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "month and year are required" });
      }
      const data = await storage.getStaffRevenueReport(month, year, practiceId, department);
      res.json({ success: true, data });
    } catch (error) {
      console.error("Staff revenue report error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch staff revenue report" });
    }
  });

  app.get("/api/admin/new-enrollments", adminAuth, async (req: Request, res: Response) => {
    try {
      const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = req.query.month as string;
      const year = parseInt(req.query.year as string);
      const practiceIdParam = req.query.practiceId as string | undefined;
      const departmentParam = req.query.department as string | undefined;

      if (!month || !year) {
        return res.status(400).json({ success: false, message: "month and year required" });
      }

      const monthIdx = MONTHS.indexOf(month);
      let prevMonth: string;
      let prevYear: number;
      if (monthIdx === 0) {
        prevMonth = "DEC";
        prevYear = year - 1;
      } else {
        prevMonth = MONTHS[monthIdx - 1];
        prevYear = year;
      }

      const allPractices = await db.select().from(practices);
      const lynkPractice = allPractices.find(p => p.name === "Lynk Health" || p.name?.includes("Lynk Demo"));
      const lynkId = lynkPractice?.id || 5;
      const practiceNameMap = new Map<number, string>();
      for (const p of allPractices) practiceNameMap.set(p.id, p.name);

      const currentSnaps = await db.select().from(programSnapshots)
        .where(and(
          eq(programSnapshots.month, month),
          eq(programSnapshots.year, year),
        ));
      const prevSnaps = await db.select().from(programSnapshots)
        .where(and(
          eq(programSnapshots.month, prevMonth),
          eq(programSnapshots.year, prevYear),
        ));

      const prevMap = new Map<string, number>();
      for (const s of prevSnaps) {
        if (s.practiceId === lynkId) continue;
        const key = `${s.practiceId}|${s.programType}|${s.department || ""}`;
        prevMap.set(key, s.patientsEnrolled || 0);
      }

      type EnrollmentDelta = {
        practiceId: number;
        practiceName: string;
        programType: string;
        department: string | null;
        currentEnrolled: number;
        previousEnrolled: number;
        newEnrollments: number;
      };

      const deltas: EnrollmentDelta[] = [];
      let totalNew = 0;

      for (const s of currentSnaps) {
        if (s.practiceId === lynkId) continue;
        if (practiceIdParam && String(s.practiceId) !== practiceIdParam) continue;
        if (departmentParam && s.department !== departmentParam) continue;
        if (!departmentParam && s.department) continue;
        const key = `${s.practiceId}|${s.programType}|${s.department || ""}`;
        const prev = prevMap.get(key) || 0;
        const current = s.patientsEnrolled || 0;
        const diff = Math.max(0, current - prev);
        if (diff > 0 || current > 0) {
          deltas.push({
            practiceId: s.practiceId,
            practiceName: practiceNameMap.get(s.practiceId) || "Unknown",
            programType: s.programType,
            department: s.department,
            currentEnrolled: current,
            previousEnrolled: prev,
            newEnrollments: diff,
          });
        }
        totalNew += diff;
      }

      const overrides = await db.select().from(staffRoleOverrides);
      const enrollmentSpecialist = overrides.find(o => o.overrideRole === "Enrollment Specialist");

      res.json({
        success: true,
        month,
        year,
        previousMonth: prevMonth,
        previousYear: prevYear,
        totalNewEnrollments: totalNew,
        enrollmentSpecialist: enrollmentSpecialist ? {
          staffTcId: enrollmentSpecialist.staffTcId,
          staffName: enrollmentSpecialist.staffName,
          role: enrollmentSpecialist.overrideRole,
        } : null,
        deltas: deltas.filter(d => !d.department).sort((a, b) => b.newEnrollments - a.newEnrollments),
        departmentDeltas: deltas.filter(d => d.department).sort((a, b) => b.newEnrollments - a.newEnrollments),
      });
    } catch (error) {
      console.error("New enrollments error:", error);
      res.status(500).json({ success: false, message: "Failed to calculate new enrollments" });
    }
  });

  app.get("/api/admin/staff-role-overrides", adminAuth, async (req: Request, res: Response) => {
    try {
      const overrides = await db.select().from(staffRoleOverrides);
      res.json({ success: true, overrides });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch role overrides" });
    }
  });

  app.post("/api/admin/staff-role-overrides", adminAuth, async (req: Request, res: Response) => {
    try {
      const { staffTcId, staffName, overrideRole } = req.body;
      if (!staffTcId || !staffName || !overrideRole) {
        return res.status(400).json({ success: false, message: "staffTcId, staffName, and overrideRole are required" });
      }
      const existing = await db.select().from(staffRoleOverrides).where(eq(staffRoleOverrides.staffTcId, staffTcId));
      if (existing.length > 0) {
        await db.update(staffRoleOverrides).set({ overrideRole, staffName }).where(eq(staffRoleOverrides.staffTcId, staffTcId));
      } else {
        await db.insert(staffRoleOverrides).values({ staffTcId, staffName, overrideRole });
      }
      await db.update(tcStaffTimeLogs).set({ staffRole: overrideRole }).where(eq(tcStaffTimeLogs.staffTcId, staffTcId));
      res.json({ success: true });
    } catch (error) {
      console.error("Staff role override error:", error);
      res.status(500).json({ success: false, message: "Failed to save role override" });
    }
  });

  app.delete("/api/admin/staff-role-overrides/:staffTcId", adminAuth, async (req: Request, res: Response) => {
    try {
      const { staffTcId } = req.params;
      await db.delete(staffRoleOverrides).where(eq(staffRoleOverrides.staffTcId, staffTcId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete role override" });
    }
  });

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

  app.post("/api/admin/era/upload", adminAuth, upload.single("file"), async (req: Request, res: Response) => {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const { practiceId, month, year, department } = req.body;
      if (!practiceId || !month || !year) {
        return res.status(400).json({ success: false, message: "practiceId, month, and year are required" });
      }

      const content = file.buffer.toString("utf-8");
      const result = parse835(content);

      const [uploadRecord] = await db.insert(eraUploads).values({
        practiceId: parseInt(practiceId),
        department: department || null,
        month: month.toUpperCase(),
        year: parseInt(year),
        filename: file.originalname,
        status: result.errors.length > 0 ? "parse_errors" : "processed",
        totalClaims: result.totalClaims,
        totalPaidCents: result.totalPaidCents,
        totalBilledCents: result.totalBilledCents,
        totalAdjustmentCents: result.totalAdjustmentCents,
        matchedClaims: 0,
        unmatchedClaims: 0,
        uploadedBy: req.adminUser?.id || null,
        rawContent: content,
        parseErrors: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
      }).returning();

      let matchedCount = 0;
      let unmatchedCount = 0;

      for (const claim of result.claims) {
        const programType = mapCptToProgram(claim.cptCode);

        let systemRevenueCents: number | null = null;
        let varianceCents: number | null = null;
        let matchStatus = "unmatched";

        if (programType) {
          const billingCodes = await storage.getCptBillingCodes(parseInt(year));
          const matchingCode = billingCodes.find(c => c.code === claim.cptCode && c.isActive);
          if (matchingCode) {
            systemRevenueCents = matchingCode.rateCents * claim.units;
            varianceCents = claim.paidCents - systemRevenueCents;
            matchStatus = "matched";
            matchedCount++;
          } else {
            unmatchedCount++;
          }
        } else {
          unmatchedCount++;
        }

        await db.insert(eraLineItems).values({
          uploadId: uploadRecord.id,
          claimId: claim.claimId,
          patientName: claim.patientName,
          payerClaimId: claim.payerClaimId,
          serviceDate: claim.serviceDate,
          cptCode: claim.cptCode,
          modifier: claim.modifier,
          units: claim.units,
          billedCents: claim.billedCents,
          paidCents: claim.paidCents,
          allowedCents: claim.allowedCents,
          adjustmentCents: claim.adjustmentCents,
          adjustmentReason: claim.adjustmentReason,
          programType: programType || "UNKNOWN",
          matchStatus,
          systemRevenueCents,
          varianceCents,
          notes: null,
        });
      }


      await db.update(eraUploads)
        .set({ matchedClaims: matchedCount, unmatchedClaims: unmatchedCount })
        .where(eq(eraUploads.id, uploadRecord.id));

      res.json({
        success: true,
        upload: { ...uploadRecord, matchedClaims: matchedCount, unmatchedClaims: unmatchedCount },
        summary: {
          totalClaims: result.totalClaims,
          totalLineItems: result.claims.length,
          totalPaid: result.totalPaidCents / 100,
          totalBilled: result.totalBilledCents / 100,
          totalAdjustments: result.totalAdjustmentCents / 100,
          matched: matchedCount,
          unmatched: unmatchedCount,
          payerName: result.payerName,
          payeeName: result.payeeName,
          errors: result.errors,
        },
      });
    } catch (error: any) {
      console.error("ERA upload error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to process ERA file" });
    }
  });

  app.get("/api/admin/era/uploads", adminAuth, async (req: Request, res: Response) => {
    try {
      const { practiceId, month, year } = req.query;
      let query = db.select({
        id: eraUploads.id,
        practiceId: eraUploads.practiceId,
        department: eraUploads.department,
        month: eraUploads.month,
        year: eraUploads.year,
        filename: eraUploads.filename,
        status: eraUploads.status,
        totalClaims: eraUploads.totalClaims,
        totalPaidCents: eraUploads.totalPaidCents,
        totalBilledCents: eraUploads.totalBilledCents,
        totalAdjustmentCents: eraUploads.totalAdjustmentCents,
        matchedClaims: eraUploads.matchedClaims,
        unmatchedClaims: eraUploads.unmatchedClaims,
        uploadedAt: eraUploads.uploadedAt,
      }).from(eraUploads).orderBy(desc(eraUploads.uploadedAt));

      const conditions: any[] = [];
      if (practiceId) conditions.push(eq(eraUploads.practiceId, parseInt(practiceId as string)));
      if (month) conditions.push(eq(eraUploads.month, (month as string).toUpperCase()));
      if (year) conditions.push(eq(eraUploads.year, parseInt(year as string)));

      const results = conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

      res.json({ success: true, uploads: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/era/uploads/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const [upload] = await db.select().from(eraUploads).where(eq(eraUploads.id, id));
      if (!upload) {
        return res.status(404).json({ success: false, message: "Upload not found" });
      }
      const lineItems = await db.select().from(eraLineItems).where(eq(eraLineItems.uploadId, id));

      res.json({ success: true, upload: { ...upload, rawContent: undefined }, lineItems });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/era/reconciliation", adminAuth, async (req: Request, res: Response) => {
    try {
      const { practiceId, month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ success: false, message: "month and year are required" });
      }

      const conditions: any[] = [
        eq(eraLineItems.matchStatus, "matched"),
      ];

      const uploadConditions: any[] = [
        eq(eraUploads.month, (month as string).toUpperCase()),
        eq(eraUploads.year, parseInt(year as string)),
      ];
      if (practiceId) uploadConditions.push(eq(eraUploads.practiceId, parseInt(practiceId as string)));

      const uploads = await db.select({ id: eraUploads.id }).from(eraUploads).where(and(...uploadConditions));
      const uploadIds = uploads.map(u => u.id);

      if (uploadIds.length === 0) {
        return res.json({
          success: true,
          summary: { totalPaid: 0, totalSystemRevenue: 0, totalVariance: 0, lineCount: 0 },
          discrepancies: [],
        });
      }

      const allLineItems = await db.select().from(eraLineItems)
        .where(sql`${eraLineItems.uploadId} IN (${sql.join(uploadIds.map(id => sql`${id}`), sql`, `)})`);

      const matched = allLineItems.filter(li => li.matchStatus === "matched");
      const discrepancies = matched.filter(li => li.varianceCents !== null && li.varianceCents !== 0);

      const totalPaid = matched.reduce((s, li) => s + (li.paidCents || 0), 0);
      const totalSystemRevenue = matched.reduce((s, li) => s + (li.systemRevenueCents || 0), 0);
      const totalVariance = totalPaid - totalSystemRevenue;

      res.json({
        success: true,
        summary: {
          totalPaid: totalPaid / 100,
          totalSystemRevenue: totalSystemRevenue / 100,
          totalVariance: totalVariance / 100,
          lineCount: matched.length,
          discrepancyCount: discrepancies.length,
        },
        discrepancies: discrepancies.map(d => ({
          ...d,
          paidDollars: (d.paidCents || 0) / 100,
          systemRevenueDollars: (d.systemRevenueCents || 0) / 100,
          varianceDollars: (d.varianceCents || 0) / 100,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/admin/era/uploads/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(eraLineItems).where(eq(eraLineItems.uploadId, id));
      await db.delete(eraUploads).where(eq(eraUploads.id, id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ---------------------------------------------------------------
  // AMBIENT AI -- Call Sessions & CareCo Import
  // ---------------------------------------------------------------

  // Get service configuration status
  app.get("/api/admin/ambient/config", adminAuth, requirePermission(Permission.VIEW_CALLS), async (_req, res) => {
    res.json({
      success: true,
      transcriptionAvailable: isTranscriptionConfigured(),
      soapGenerationAvailable: isSoapGenerationConfigured(),
    });
  });

  // Import a single call session with transcript + SOAP note from CareCo
  app.post("/api/admin/calls/import", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const schema = z.object({
        patientReference: z.string().optional(),
        practiceId: z.number().optional(),
        programType: z.string().optional(),
        callDate: z.string().optional(),
        durationMinutes: z.number().optional(),
        transcript: z.string().optional(),
        subjective: z.string().optional(),
        objective: z.string().optional(),
        assessment: z.string().optional(),
        plan: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const callDate = validated.callDate ? new Date(validated.callDate) : new Date();
      const durationSeconds = validated.durationMinutes ? validated.durationMinutes * 60 : null;

      const session = await storage.createCallSession({
        clinicianId: req.adminUser!.id,
        practiceId: validated.practiceId || null,
        patientReference: validated.patientReference || null,
        programType: validated.programType || null,
        callStartedAt: callDate,
        callEndedAt: durationSeconds ? new Date(callDate.getTime() + durationSeconds * 1000) : null,
        durationSeconds,
        status: "review",
      });

      let createdTranscript = null;
      let createdSoapNote = null;

      if (validated.transcript?.trim()) {
        createdTranscript = await storage.createTranscript({
          callSessionId: session.id,
          content: validated.transcript,
          segments: null,
          provider: "careco",
          languageCode: "en-US",
          confidenceScore: null,
        });
      }

      const hasSoap = validated.subjective || validated.objective || validated.assessment || validated.plan;
      if (hasSoap) {
        createdSoapNote = await storage.createSoapNote({
          callSessionId: session.id,
          subjective: validated.subjective || "",
          objective: validated.objective || "",
          assessment: validated.assessment || "",
          plan: validated.plan || "",
          status: "draft",
          aiModel: "careco",
          aiConfidence: null,
        });
      }

      let timeEntry = null;
      if (validated.durationMinutes && validated.programType) {
        const dateStr = callDate.toISOString().split("T")[0];
        timeEntry = await storage.createTimeEntry({
          callSessionId: session.id,
          clinicianId: req.adminUser!.id,
          practiceId: validated.practiceId || null,
          programType: validated.programType,
          date: dateStr,
          durationMinutes: validated.durationMinutes,
          notes: null,
        });
      }

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.CALL_SESSION_CREATED,
        resourceType: "call_session",
        resourceId: String(session.id),
        outcome: "success",
        phiAccessed: true,
        details: {
          source: "careco_import",
          hasTranscript: !!createdTranscript,
          hasSoapNote: !!createdSoapNote,
          hasTimeEntry: !!timeEntry,
          programType: validated.programType,
        },
      }));

      res.json({ success: true, session, transcript: createdTranscript, soapNote: createdSoapNote, timeEntry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid import data", errors: error.errors });
      }
      console.error("Import call error:", error);
      res.status(500).json({ success: false, message: "Failed to import call" });
    }
  });

  // Bulk import -- array of CareCo records
  app.post("/api/admin/calls/import-bulk", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const schema = z.object({
        records: z.array(z.object({
          patientReference: z.string().optional(),
          practiceId: z.number().optional(),
          programType: z.string().optional(),
          callDate: z.string().optional(),
          durationMinutes: z.number().optional(),
          transcript: z.string().optional(),
          subjective: z.string().optional(),
          objective: z.string().optional(),
          assessment: z.string().optional(),
          plan: z.string().optional(),
        })).min(1).max(100),
      });
      const { records } = schema.parse(req.body);

      const results: { index: number; sessionId: number; success: boolean; error?: string }[] = [];

      for (let i = 0; i < records.length; i++) {
        try {
          const rec = records[i];
          const callDate = rec.callDate ? new Date(rec.callDate) : new Date();
          const durationSeconds = rec.durationMinutes ? rec.durationMinutes * 60 : null;

          const session = await storage.createCallSession({
            clinicianId: req.adminUser!.id,
            practiceId: rec.practiceId || null,
            patientReference: rec.patientReference || null,
            programType: rec.programType || null,
            callStartedAt: callDate,
            callEndedAt: durationSeconds ? new Date(callDate.getTime() + durationSeconds * 1000) : null,
            durationSeconds,
            status: "review",
          });

          if (rec.transcript?.trim()) {
            await storage.createTranscript({
              callSessionId: session.id,
              content: rec.transcript,
              segments: null,
              provider: "careco",
              languageCode: "en-US",
              confidenceScore: null,
            });
          }

          const hasSoap = rec.subjective || rec.objective || rec.assessment || rec.plan;
          if (hasSoap) {
            await storage.createSoapNote({
              callSessionId: session.id,
              subjective: rec.subjective || "",
              objective: rec.objective || "",
              assessment: rec.assessment || "",
              plan: rec.plan || "",
              status: "draft",
              aiModel: "careco",
              aiConfidence: null,
            });
          }

          if (rec.durationMinutes && rec.programType) {
            await storage.createTimeEntry({
              callSessionId: session.id,
              clinicianId: req.adminUser!.id,
              practiceId: rec.practiceId || null,
              programType: rec.programType,
              date: callDate.toISOString().split("T")[0],
              durationMinutes: rec.durationMinutes,
              notes: null,
            });
          }

          results.push({ index: i, sessionId: session.id, success: true });
        } catch (err: any) {
          results.push({ index: i, sessionId: 0, success: false, error: err.message || "Failed" });
        }
      }

      const imported = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.CALL_SESSION_CREATED,
        resourceType: "call_session",
        outcome: "success",
        phiAccessed: true,
        details: { source: "careco_bulk_import", total: records.length, imported, failed },
      }));

      res.json({ success: true, imported, failed, total: records.length, results });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid bulk import data", errors: error.errors });
      }
      console.error("Bulk import error:", error);
      res.status(500).json({ success: false, message: "Failed to process bulk import" });
    }
  });

  // List call sessions
  app.get("/api/admin/calls", adminAuth, requirePermission(Permission.VIEW_CALLS), async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.clinicianId) filters.clinicianId = parseInt(req.query.clinicianId as string);
      if (req.query.practiceId) filters.practiceId = parseInt(req.query.practiceId as string);
      if (req.query.programType) filters.programType = req.query.programType;
      if (req.query.status) filters.status = req.query.status;

      const sessions = await storage.getCallSessions(filters);

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PHI_READ,
        resourceType: "call_session",
        outcome: "success",
        phiAccessed: true,
        details: { count: sessions.length, filters },
      }));

      res.json({ success: true, sessions });
    } catch (error) {
      console.error("List call sessions error:", error);
      res.status(500).json({ success: false, message: "Failed to load call sessions" });
    }
  });

  // Create a new call session (start recording)
  app.post("/api/admin/calls", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const schema = z.object({
        patientReference: z.string().optional(),
        practiceId: z.number().optional(),
        programType: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const session = await storage.createCallSession({
        clinicianId: req.adminUser!.id,
        practiceId: validated.practiceId || null,
        patientReference: validated.patientReference || null,
        programType: validated.programType || null,
        callStartedAt: new Date(),
        status: "recording",
      });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.CALL_SESSION_CREATED,
        resourceType: "call_session",
        resourceId: String(session.id),
        outcome: "success",
        phiAccessed: true,
        details: { programType: validated.programType },
      }));

      res.json({ success: true, session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid call session data", errors: error.errors });
      }
      console.error("Create call session error:", error);
      res.status(500).json({ success: false, message: "Failed to create call session" });
    }
  });

  // Get a single call session with transcript and SOAP note
  app.get("/api/admin/calls/:id", adminAuth, requirePermission(Permission.VIEW_CALLS), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getCallSession(id);
      if (!session) {
        return res.status(404).json({ success: false, message: "Call session not found" });
      }

      const transcript = await storage.getTranscriptByCallSession(id);
      const soapNote = await storage.getSoapNoteByCallSession(id);

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PHI_READ,
        resourceType: "call_session",
        resourceId: String(id),
        outcome: "success",
        phiAccessed: true,
      }));

      res.json({ success: true, session, transcript, soapNote });
    } catch (error) {
      console.error("Get call session error:", error);
      res.status(500).json({ success: false, message: "Failed to load call session" });
    }
  });

  // End a call session
  app.put("/api/admin/calls/:id/end", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getCallSession(id);
      if (!session) {
        return res.status(404).json({ success: false, message: "Call session not found" });
      }

      const callEndedAt = new Date();
      const durationSeconds = Math.round((callEndedAt.getTime() - new Date(session.callStartedAt).getTime()) / 1000);

      await storage.updateCallSession(id, { callEndedAt, durationSeconds, status: "transcribing" });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.CALL_SESSION_ENDED,
        resourceType: "call_session",
        resourceId: String(id),
        outcome: "success",
        phiAccessed: true,
        details: { durationSeconds },
      }));

      res.json({ success: true, durationSeconds });
    } catch (error) {
      console.error("End call session error:", error);
      res.status(500).json({ success: false, message: "Failed to end call session" });
    }
  });

  // Upload audio and transcribe
  app.post("/api/admin/calls/:id/transcribe", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getCallSession(id);
      if (!session) {
        return res.status(404).json({ success: false, message: "Call session not found" });
      }

      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        const { text } = z.object({ text: z.string().min(1) }).parse(req.body);
        const result = transcribeManual(text);

        const transcript = await storage.createTranscript({
          callSessionId: id,
          content: result.content,
          segments: JSON.stringify(result.segments),
          provider: result.provider,
          languageCode: result.languageCode,
          confidenceScore: String(result.confidenceScore),
        });

        await storage.updateCallSession(id, { status: "generating" });

        await writeAuditLog(auditFromRequest(req, {
          action: AuditAction.CALL_TRANSCRIBED,
          resourceType: "transcript",
          resourceId: String(transcript.id),
          outcome: "success",
          phiAccessed: true,
          details: { provider: "manual", callSessionId: id },
        }));

        res.json({ success: true, transcript });
      } else {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const audioBuffer = Buffer.concat(chunks);
            if (audioBuffer.length === 0) {
              return res.status(400).json({ success: false, message: "No audio data received" });
            }

            const mimeType = contentType.split(";")[0] || "audio/webm";
            const result = await transcribeAudio(audioBuffer, mimeType);

            const transcript = await storage.createTranscript({
              callSessionId: id,
              content: result.content,
              segments: JSON.stringify(result.segments),
              provider: result.provider,
              languageCode: result.languageCode,
              confidenceScore: String(result.confidenceScore),
            });

            await storage.updateCallSession(id, { status: "generating" });

            await writeAuditLog(auditFromRequest(req, {
              action: AuditAction.CALL_TRANSCRIBED,
              resourceType: "transcript",
              resourceId: String(transcript.id),
              outcome: "success",
              phiAccessed: true,
              details: { provider: result.provider, callSessionId: id, confidence: result.confidenceScore },
            }));

            res.json({ success: true, transcript });
          } catch (error: any) {
            console.error("Transcription error:", error);
            await storage.updateCallSession(id, { status: "review" });
            res.status(500).json({ success: false, message: error.message || "Transcription failed" });
          }
        });
        return;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid transcription data", errors: error.errors });
      }
      console.error("Transcribe error:", error);
      res.status(500).json({ success: false, message: "Transcription failed" });
    }
  });

  // Generate SOAP note from transcript
  app.post("/api/admin/calls/:id/generate-soap", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getCallSession(id);
      if (!session) return res.status(404).json({ success: false, message: "Call session not found" });

      const transcript = await storage.getTranscriptByCallSession(id);
      if (!transcript) return res.status(400).json({ success: false, message: "No transcript found. Transcribe the call first." });

      let soapResult;
      if (isSoapGenerationConfigured()) {
        soapResult = await generateSoapNote(transcript.content, session.programType || undefined);
      } else {
        soapResult = createBlankSoapNote();
      }

      const soapNote = await storage.createSoapNote({
        callSessionId: id,
        subjective: soapResult.subjective,
        objective: soapResult.objective,
        assessment: soapResult.assessment,
        plan: soapResult.plan,
        status: "draft",
        aiModel: soapResult.aiModel,
        aiConfidence: soapResult.aiConfidence,
      });

      await storage.updateCallSession(id, { status: "review" });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.SOAP_NOTE_GENERATED,
        resourceType: "soap_note",
        resourceId: String(soapNote.id),
        outcome: "success",
        phiAccessed: true,
        details: { callSessionId: id, aiModel: soapResult.aiModel },
      }));

      res.json({ success: true, soapNote });
    } catch (error: any) {
      console.error("SOAP generation error:", error);
      res.status(500).json({ success: false, message: error.message || "SOAP note generation failed" });
    }
  });

  // Update SOAP note (clinician edits)
  app.put("/api/admin/calls/:id/soap", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const callId = parseInt(req.params.id);
      const schema = z.object({ subjective: z.string(), objective: z.string(), assessment: z.string(), plan: z.string() });
      const validated = schema.parse(req.body);

      const soapNote = await storage.getSoapNoteByCallSession(callId);
      if (!soapNote) return res.status(404).json({ success: false, message: "SOAP note not found" });

      await storage.updateSoapNote(soapNote.id, {
        subjective: validated.subjective, objective: validated.objective,
        assessment: validated.assessment, plan: validated.plan,
        status: "reviewed", reviewedBy: req.adminUser!.id, reviewedAt: new Date(),
      });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.SOAP_NOTE_UPDATED,
        resourceType: "soap_note",
        resourceId: String(soapNote.id),
        outcome: "success",
        phiAccessed: true,
        details: { callSessionId: callId },
      }));

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, message: "Invalid SOAP note data", errors: error.errors });
      console.error("Update SOAP note error:", error);
      res.status(500).json({ success: false, message: "Failed to update SOAP note" });
    }
  });

  // Sign SOAP note (finalize)
  app.put("/api/admin/calls/:id/sign", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const callId = parseInt(req.params.id);
      const soapNote = await storage.getSoapNoteByCallSession(callId);
      if (!soapNote) return res.status(404).json({ success: false, message: "SOAP note not found" });

      await storage.updateSoapNote(soapNote.id, { status: "signed", signedBy: req.adminUser!.id, signedAt: new Date() });
      await storage.updateCallSession(callId, { status: "signed" });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.SOAP_NOTE_SIGNED,
        resourceType: "soap_note",
        resourceId: String(soapNote.id),
        outcome: "success",
        phiAccessed: true,
        details: { callSessionId: callId, signedBy: req.adminUser!.email },
      }));

      res.json({ success: true });
    } catch (error) {
      console.error("Sign SOAP note error:", error);
      res.status(500).json({ success: false, message: "Failed to sign SOAP note" });
    }
  });

  // ---------------------------------------------------------------
  // AMBIENT AI -- Time Tracking
  // ---------------------------------------------------------------

  app.get("/api/admin/time-entries", adminAuth, requirePermission(Permission.VIEW_TIME_ENTRIES), async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.clinicianId) filters.clinicianId = parseInt(req.query.clinicianId as string);
      if (req.query.practiceId) filters.practiceId = parseInt(req.query.practiceId as string);
      if (req.query.programType) filters.programType = req.query.programType;
      if (req.query.date) filters.date = req.query.date;
      const entries = await storage.getTimeEntries(filters);
      res.json({ success: true, entries });
    } catch (error) {
      console.error("List time entries error:", error);
      res.status(500).json({ success: false, message: "Failed to load time entries" });
    }
  });

  app.post("/api/admin/time-entries", adminAuth, requirePermission(Permission.MANAGE_TIME_ENTRIES), async (req, res) => {
    try {
      const schema = z.object({
        callSessionId: z.number().optional(),
        practiceId: z.number().optional(),
        programType: z.string().min(1),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        durationMinutes: z.number().min(1).max(480),
        notes: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const entry = await storage.createTimeEntry({
        ...validated,
        callSessionId: validated.callSessionId || null,
        practiceId: validated.practiceId || null,
        clinicianId: req.adminUser!.id,
        notes: validated.notes || null,
      });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.TIME_ENTRY_CREATED,
        resourceType: "time_entry",
        resourceId: String(entry.id),
        outcome: "success",
        details: { programType: validated.programType, minutes: validated.durationMinutes, date: validated.date },
      }));

      res.json({ success: true, entry });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, message: "Invalid time entry data", errors: error.errors });
      console.error("Create time entry error:", error);
      res.status(500).json({ success: false, message: "Failed to create time entry" });
    }
  });

  app.delete("/api/admin/time-entries/:id", adminAuth, requirePermission(Permission.MANAGE_TIME_ENTRIES), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTimeEntry(id);
      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.TIME_ENTRY_DELETED,
        resourceType: "time_entry",
        resourceId: String(id),
        outcome: "success",
      }));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete time entry error:", error);
      res.status(500).json({ success: false, message: "Failed to delete time entry" });
    }
  });

  app.get("/api/admin/time-entries/report", adminAuth, requirePermission(Permission.VIEW_TIME_ENTRIES), async (req, res) => {
    try {
      const entries = await storage.getTimeEntries({
        clinicianId: req.query.clinicianId ? parseInt(req.query.clinicianId as string) : undefined,
        practiceId: req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined,
        programType: req.query.programType as string | undefined,
      });

      const byProgram: Record<string, { totalMinutes: number; count: number }> = {};
      const byDate: Record<string, { totalMinutes: number; count: number }> = {};

      for (const entry of entries) {
        if (!byProgram[entry.programType]) byProgram[entry.programType] = { totalMinutes: 0, count: 0 };
        byProgram[entry.programType].totalMinutes += entry.durationMinutes;
        byProgram[entry.programType].count++;

        if (!byDate[entry.date]) byDate[entry.date] = { totalMinutes: 0, count: 0 };
        byDate[entry.date].totalMinutes += entry.durationMinutes;
        byDate[entry.date].count++;
      }

      const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);

      res.json({ success: true, totalMinutes, totalEntries: entries.length, byProgram, byDate });
    } catch (error) {
      console.error("Time report error:", error);
      res.status(500).json({ success: false, message: "Failed to generate time report" });
    }
  });
}

export async function seedBillingCodes() {
  const existing = await storage.getCptBillingCodes(2026);
  if (existing.length > 0) {
    console.log(`[Billing] 2026 billing codes already seeded (${existing.length} codes)`);
    return;
  }

  const codes2026 = [
    { code: "99490", description: "CCM - Initial 20 min clinical staff", program: "CCM", rateCents: 5824 },
    { code: "99439", description: "CCM - Each additional 20 min clinical staff", program: "CCM", rateCents: 4415 },
    { code: "99487", description: "CCM - Complex, initial 60 min clinical staff", program: "CCM", rateCents: 12550 },
    { code: "99489", description: "CCM - Complex, each additional 30 min", program: "CCM", rateCents: 6807 },
    { code: "99453", description: "RPM - Initial setup & patient education", program: "RPM", rateCents: 1768 },
    { code: "99445", description: "RPM - Remote monitoring, initial 20 min", program: "RPM", rateCents: 4258 },
    { code: "99454", description: "RPM - Device supply with daily recordings", program: "RPM", rateCents: 4258 },
    { code: "99470", description: "RPM - Self-measured BP monitoring setup", program: "RPM", rateCents: 2260 },
    { code: "99457", description: "RPM - Remote physiologic monitoring treatment, initial 20 min", program: "RPM", rateCents: 4488 },
    { code: "99458", description: "RPM - Remote physiologic monitoring treatment, additional 20 min", program: "RPM", rateCents: 3641 },
    { code: "99473", description: "RPM - Self-measured BP patient education/training", program: "RPM", rateCents: 1253 },
    { code: "99474", description: "RPM - Separate self-measurement BP readings", program: "RPM", rateCents: 1578 },
    { code: "99484", description: "BHI - Care management services, initial 20 min", program: "BHI", rateCents: 5086 },
    { code: "99424", description: "PCM - Initial 30 min clinical staff", program: "PCM", rateCents: 7755 },
    { code: "99425", description: "PCM - Each additional 30 min clinical staff", program: "PCM", rateCents: 5441 },
    { code: "99426", description: "PCM - Initial 30 min physician/QHP", program: "PCM", rateCents: 5960 },
    { code: "99427", description: "PCM - Each additional 30 min physician/QHP", program: "PCM", rateCents: 4720 },
    { code: "98975", description: "RTM - Initial setup & patient education", program: "RTM", rateCents: 1768 },
    { code: "98976", description: "RTM - Device supply with daily recordings (respiratory)", program: "RTM", rateCents: 4258 },
    { code: "98977", description: "RTM - Device supply with daily recordings (musculoskeletal)", program: "RTM", rateCents: 4204 },
    { code: "98980", description: "RTM - Treatment management, initial 20 min", program: "RTM", rateCents: 4687 },
    { code: "98981", description: "RTM - Treatment management, additional 20 min", program: "RTM", rateCents: 3645 },
    { code: "G0556", description: "APCM - Monthly care management, low complexity", program: "APCM", rateCents: 1441 },
    { code: "G0557", description: "APCM - Monthly care management, moderate complexity", program: "APCM", rateCents: 4719 },
    { code: "G0558", description: "APCM - Monthly care management, high complexity", program: "APCM", rateCents: 10280 },
    { code: "G0438", description: "AWV - Initial annual wellness visit", program: "AWV", rateCents: 15343 },
    { code: "G0439", description: "AWV - Subsequent annual wellness visit", program: "AWV", rateCents: 12080 },
    { code: "99495", description: "TCM - Transitional care, moderate complexity (face-to-face within 14 days)", program: "TCM", rateCents: 19157 },
    { code: "99496", description: "TCM - Transitional care, high complexity (face-to-face within 7 days)", program: "TCM", rateCents: 26003 },
  ];

  for (const c of codes2026) {
    await storage.createCptBillingCode({
      ...c,
      effectiveYear: 2026,
      state: "MS",
      isActive: 1,
    });
  }
  console.log(`[Billing] Seeded ${codes2026.length} billing codes for 2026`);
}

export async function seedAdminUsers() {
  const admins = [
    { email: "alexander.barrett@lynkhealthcare.com", name: "Alexander Barrett" },
    { email: "will.moon@lynkhealthcare.com", name: "Will Moon" },
  ];

  for (const admin of admins) {
    const existing = await storage.getAdminUserByEmail(admin.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash("LynkAdmin2026!", 12);
      await storage.createAdminUser({
        email: admin.email,
        name: admin.name,
        passwordHash,
        role: "admin",
      });
      console.log(`[Admin] Created admin account: ${admin.email}`);
    }
  }
}
