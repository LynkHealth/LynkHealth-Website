import type { Express, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { adminLoginSchema, changePasswordSchema, adminPasswordSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { runFullSync, runHistoricalSync, getSyncStatus } from "./thoroughcare-sync";
import { testConnection } from "./thoroughcare-client";
import { writeAuditLog, auditFromRequest, getAuditLogs, AuditAction, getClientIp } from "./audit";
import { requirePermission, Permission } from "./rbac";
import { transcribeAudio, transcribeManual, isTranscriptionConfigured } from "./transcription-service";
import { generateSoapNote, createBlankSoapNote, isSoapGenerationConfigured } from "./soap-generator";

// ================================================================
// Constants
// ================================================================

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;    // 15 minutes (HIPAA auto-logoff)
const MAX_SESSION_LIFETIME_MS = 4 * 60 * 60 * 1000; // 4 hours absolute max
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const PASSWORD_HISTORY_COUNT = 5;
const PASSWORD_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

// Login rate limiter - 5 attempts per 15 minutes per IP
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || "unknown",
});

// ================================================================
// Type augmentation
// ================================================================

declare global {
  namespace Express {
    interface Request {
      adminUser?: { id: number; email: string; name: string; role: string };
    }
  }
}

// ================================================================
// Session cookie helpers
// ================================================================

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

// ================================================================
// Auth middleware (HIPAA 164.312(a)(2)(iii), 164.312(d))
// ================================================================

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  // Support both cookie and Bearer token (for backward compatibility during migration)
  const token = req.cookies?.admin_session || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const session = await storage.getAdminSession(token);
  if (!session) {
    await writeAuditLog({
      action: AuditAction.INVALID_SESSION,
      resourceType: "session",
      ipAddress: getClientIp(req),
      userAgent: (req.headers["user-agent"] || "").substring(0, 500),
      outcome: "failure",
    });
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session expired" });
  }

  const now = new Date();

  // Check absolute session expiration (4 hours)
  if (now > new Date(session.expiresAt)) {
    await storage.deleteAdminSession(token);
    await writeAuditLog({
      action: AuditAction.SESSION_EXPIRED,
      resourceType: "session",
      userId: session.userId,
      ipAddress: getClientIp(req),
      outcome: "failure",
      details: { reason: "absolute_expiry" },
    });
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session expired" });
  }

  // Check inactivity timeout (15 minutes -- HIPAA auto-logoff)
  const lastActivity = new Date(session.lastActivityAt);
  if (now.getTime() - lastActivity.getTime() > INACTIVITY_TIMEOUT_MS) {
    await storage.deleteAdminSession(token);
    await writeAuditLog({
      action: AuditAction.SESSION_EXPIRED,
      resourceType: "session",
      userId: session.userId,
      ipAddress: getClientIp(req),
      outcome: "failure",
      details: { reason: "inactivity", lastActivityAt: session.lastActivityAt },
    });
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session timed out due to inactivity" });
  }

  // Session IP binding check
  const currentIp = getClientIp(req);
  if (session.ipAddress && session.ipAddress !== currentIp) {
    await storage.deleteAdminSession(token);
    await writeAuditLog({
      action: AuditAction.INVALID_SESSION,
      resourceType: "session",
      userId: session.userId,
      ipAddress: currentIp,
      outcome: "failure",
      details: { reason: "ip_mismatch", sessionIp: session.ipAddress, requestIp: currentIp },
    });
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Session invalidated" });
  }

  // Load user and check active status
  const adminUser = await storage.getAdminUserById(session.userId);
  if (!adminUser || !adminUser.isActive) {
    await storage.deleteAdminSession(token);
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Account deactivated" });
  }

  // Update last activity (sliding window)
  await storage.updateSessionActivity(token, now);

  // Refresh cookie expiration
  setSessionCookie(res, token);

  req.adminUser = { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: adminUser.role };
  next();
}

// ================================================================
// Route registration
// ================================================================

export async function registerAdminRoutes(app: Express) {

  // ---------------------------------------------------------------
  // LOGIN (HIPAA 164.312(d) -- Authentication)
  // ---------------------------------------------------------------
  app.post("/api/admin/login", loginRateLimit, async (req, res) => {
    try {
      const { email, password } = adminLoginSchema.parse(req.body);
      const ip = getClientIp(req);
      const ua = (req.headers["user-agent"] || "").substring(0, 500);

      // Check persistent lockout
      const failedCount = await storage.getRecentFailedAttempts(email, LOCKOUT_WINDOW_MS);
      if (failedCount >= MAX_FAILED_ATTEMPTS) {
        await writeAuditLog({
          action: AuditAction.ACCOUNT_LOCKED,
          resourceType: "admin_user",
          userEmail: email,
          ipAddress: ip,
          userAgent: ua,
          outcome: "failure",
          details: { failedAttempts: failedCount },
        });
        return res.status(429).json({
          success: false,
          message: "Account temporarily locked due to too many failed attempts. Try again later.",
        });
      }

      const user = await storage.getAdminUserByEmail(email);
      if (!user || !user.isActive) {
        await storage.recordLoginAttempt(email, ip, false);
        await writeAuditLog({
          action: AuditAction.LOGIN_FAILURE,
          resourceType: "admin_user",
          userEmail: email,
          ipAddress: ip,
          userAgent: ua,
          outcome: "failure",
          details: { reason: !user ? "user_not_found" : "account_inactive" },
        });
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        await storage.recordLoginAttempt(email, ip, false);
        await writeAuditLog({
          action: AuditAction.LOGIN_FAILURE,
          resourceType: "admin_user",
          resourceId: String(user.id),
          userId: user.id,
          userEmail: email,
          ipAddress: ip,
          userAgent: ua,
          outcome: "failure",
          details: { reason: "invalid_password" },
        });
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      // Successful login
      await storage.recordLoginAttempt(email, ip, true);

      // Invalidate any existing sessions for this user (single session enforcement)
      await storage.deleteUserSessions(user.id);

      const token = crypto.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + MAX_SESSION_LIFETIME_MS);
      await storage.createAdminSession(user.id, token, expiresAt, ip, ua);

      // Update last login timestamp
      await storage.updateAdminUser(user.id, { lastLoginAt: new Date() });

      // Set httpOnly cookie
      setSessionCookie(res, token);

      await writeAuditLog({
        action: AuditAction.LOGIN_SUCCESS,
        resourceType: "admin_user",
        resourceId: String(user.id),
        userId: user.id,
        userEmail: email,
        userRole: user.role,
        ipAddress: ip,
        userAgent: ua,
        outcome: "success",
      });

      // Check if password change is required
      const passwordExpired = !user.passwordChangedAt ||
        (Date.now() - new Date(user.passwordChangedAt).getTime() > PASSWORD_MAX_AGE_MS);

      res.json({
        success: true,
        token, // Still send token for backward compat during migration
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        passwordChangeRequired: passwordExpired,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid login data" });
      }
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // ---------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------
  app.post("/api/admin/logout", adminAuth, async (req, res) => {
    const token = req.cookies?.admin_session || req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      await storage.deleteAdminSession(token);
    }
    clearSessionCookie(res);
    await writeAuditLog(auditFromRequest(req, {
      action: AuditAction.LOGOUT,
      resourceType: "session",
      outcome: "success",
    }));
    res.json({ success: true });
  });

  // ---------------------------------------------------------------
  // CURRENT USER
  // ---------------------------------------------------------------
  app.get("/api/admin/me", adminAuth, async (req, res) => {
    const user = await storage.getAdminUserById(req.adminUser!.id);
    const passwordExpired = !user?.passwordChangedAt ||
      (Date.now() - new Date(user.passwordChangedAt).getTime() > PASSWORD_MAX_AGE_MS);
    res.json({
      success: true,
      user: req.adminUser,
      passwordChangeRequired: passwordExpired,
    });
  });

  // ---------------------------------------------------------------
  // CHANGE PASSWORD (HIPAA 164.312(d))
  // ---------------------------------------------------------------
  app.put("/api/admin/change-password", adminAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const user = await storage.getAdminUserById(req.adminUser!.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Verify current password
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        await writeAuditLog(auditFromRequest(req, {
          action: AuditAction.ADMIN_PASSWORD_CHANGED,
          resourceType: "admin_user",
          resourceId: String(user.id),
          outcome: "failure",
          details: { reason: "invalid_current_password" },
        }));
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }

      // Check password history (prevent reuse of last 5)
      const history = await storage.getPasswordHistory(user.id, PASSWORD_HISTORY_COUNT);
      for (const entry of history) {
        const reused = await bcrypt.compare(newPassword, entry.passwordHash);
        if (reused) {
          return res.status(400).json({
            success: false,
            message: `Cannot reuse any of your last ${PASSWORD_HISTORY_COUNT} passwords`,
          });
        }
      }

      // Hash and save
      const newHash = await bcrypt.hash(newPassword, 12);
      await storage.addPasswordHistory(user.id, user.passwordHash);
      await storage.updateAdminUser(user.id, {
        passwordHash: newHash,
        passwordChangedAt: new Date(),
      });

      // Invalidate all sessions except current
      await storage.deleteUserSessions(user.id);
      // Re-create current session
      const token = crypto.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + MAX_SESSION_LIFETIME_MS);
      const ip = getClientIp(req);
      const ua = (req.headers["user-agent"] || "").substring(0, 500);
      await storage.createAdminSession(user.id, token, expiresAt, ip, ua);
      setSessionCookie(res, token);

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.ADMIN_PASSWORD_CHANGED,
        resourceType: "admin_user",
        resourceId: String(user.id),
        outcome: "success",
      }));

      res.json({ success: true, message: "Password changed successfully", token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid password data", errors: error.errors });
      }
      console.error("Password change error:", error);
      res.status(500).json({ success: false, message: "Failed to change password" });
    }
  });

  // ---------------------------------------------------------------
  // DASHBOARD (no PHI -- separated per HIPAA minimum necessary)
  // ---------------------------------------------------------------
  app.get("/api/admin/dashboard", adminAuth, requirePermission(Permission.VIEW_DASHBOARD), async (req, res) => {
    try {
      const now = new Date();
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = req.query.month as string || monthNames[now.getMonth()];
      const year = parseInt(req.query.year as string) || now.getFullYear();
      const snapshots = await storage.getAggregatedSnapshots(month, year);
      const practicesList = await storage.getPractices();

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

      // NOTE: inquiries intentionally NOT included -- requires VIEW_INQUIRIES permission
      res.json({ success: true, snapshots, practices: practicesList, departmentsByPractice, month, year });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ success: false, message: "Failed to load dashboard" });
    }
  });

  // ---------------------------------------------------------------
  // PRACTICES
  // ---------------------------------------------------------------
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

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PRACTICE_CREATED,
        resourceType: "practice",
        resourceId: String(practice.id),
        outcome: "success",
        details: { name: practice.name },
      }));

      res.json({ success: true, practice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid practice data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to create practice" });
    }
  });

  // ---------------------------------------------------------------
  // SNAPSHOTS
  // ---------------------------------------------------------------
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

  // ---------------------------------------------------------------
  // INQUIRIES (PII + PHI access -- audit logged)
  // ---------------------------------------------------------------
  app.get("/api/admin/inquiries", adminAuth, requirePermission(Permission.VIEW_INQUIRIES), async (req, res) => {
    try {
      const contactInquiries = await storage.getContactInquiries();
      const nightInquiries = await storage.getNightCoverageInquiries();
      const woundReferrals = await storage.getWoundCareReferrals();

      // Audit log: PHI access (wound referrals contain patient data)
      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PHI_READ,
        resourceType: "wound_care_referral",
        outcome: "success",
        phiAccessed: true,
        details: { count: woundReferrals.length },
      }));
      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.PII_READ,
        resourceType: "contact_inquiry",
        outcome: "success",
        details: { contactCount: contactInquiries.length, nightCount: nightInquiries.length },
      }));

      res.json({ success: true, contactInquiries, nightInquiries, woundReferrals });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load inquiries" });
    }
  });

  // ---------------------------------------------------------------
  // THOROUGHCARE SYNC
  // ---------------------------------------------------------------
  app.get("/api/admin/tc/status", adminAuth, async (_req, res) => {
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

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.TC_SYNC_STARTED,
        resourceType: "tc_sync",
        outcome: "success",
        phiAccessed: true,
        details: { month, year, type: "full" },
      }));

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

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.TC_SYNC_STARTED,
        resourceType: "tc_sync",
        outcome: "success",
        phiAccessed: true,
        details: { totalMonths, type: "historical" },
      }));

      res.json({ success: true, message: `Historical sync started (${totalMonths} months)` });
      runHistoricalSync(totalMonths).catch((err) => {
        console.error("[TC Historical Sync] Background sync error:", err);
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start historical sync" });
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

  app.get("/api/admin/tc/sample-enrollments", adminAuth, requirePermission(Permission.VIEW_TC_SAMPLES), async (req, res) => {
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

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.TC_DATA_FETCHED,
        resourceType: "tc_enrollment",
        outcome: "success",
        phiAccessed: true,
        details: { sampleCount: samples.length },
      }));

      res.json({ success: true, samples });
    } catch (error: any) {
      console.error("[Admin] Sample enrollments error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sample enrollments" });
    }
  });

  // ---------------------------------------------------------------
  // AUDIT LOGS (superadmin only -- HIPAA 164.312(b))
  // ---------------------------------------------------------------
  app.get("/api/admin/audit-logs", adminAuth, requirePermission(Permission.VIEW_AUDIT_LOGS), async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.action) filters.action = req.query.action;
      if (req.query.resourceType) filters.resourceType = req.query.resourceType;
      if (req.query.userId) filters.userId = parseInt(req.query.userId as string);
      if (req.query.phiOnly === "true") filters.phiOnly = true;
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
      if (req.query.limit) filters.limit = parseInt(req.query.limit as string);
      if (req.query.offset) filters.offset = parseInt(req.query.offset as string);

      const logs = await getAuditLogs(filters);
      res.json({ success: true, logs });
    } catch (error) {
      console.error("Audit logs error:", error);
      res.status(500).json({ success: false, message: "Failed to load audit logs" });
    }
  });

  // ---------------------------------------------------------------
  // USER MANAGEMENT (superadmin only -- HIPAA 164.312(a)(1))
  // ---------------------------------------------------------------
  app.get("/api/admin/users", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const users = await storage.getAdminUsers();
      // Strip password hashes before sending
      const sanitized = users.map(({ passwordHash, ...u }) => u);
      res.json({ success: true, users: sanitized });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load users" });
    }
  });

  app.post("/api/admin/users", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: adminPasswordSchema,
        role: z.enum(["viewer", "admin", "superadmin"]),
      });
      const { email, name, password, role } = schema.parse(req.body);

      const existing = await storage.getAdminUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: "User with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await storage.createAdminUser({
        email, name, passwordHash, role,
      });

      // Update createdBy
      await storage.updateAdminUser(user.id, { createdBy: req.adminUser!.id });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.ADMIN_USER_CREATED,
        resourceType: "admin_user",
        resourceId: String(user.id),
        outcome: "success",
        details: { email, role },
      }));

      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      }
      console.error("Create user error:", error);
      res.status(500).json({ success: false, message: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id/role", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = z.object({ role: z.enum(["viewer", "admin", "superadmin"]) }).parse(req.body);

      const user = await storage.getAdminUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const oldRole = user.role;
      await storage.updateAdminUser(userId, { role });

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.ADMIN_ROLE_CHANGED,
        resourceType: "admin_user",
        resourceId: String(userId),
        outcome: "success",
        details: { oldRole, newRole: role, targetEmail: user.email },
      }));

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      res.status(500).json({ success: false, message: "Failed to update role" });
    }
  });

  app.put("/api/admin/users/:id/deactivate", adminAuth, requirePermission(Permission.MANAGE_USERS), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Prevent self-deactivation
      if (userId === req.adminUser!.id) {
        return res.status(400).json({ success: false, message: "Cannot deactivate your own account" });
      }

      const user = await storage.getAdminUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await storage.updateAdminUser(userId, { isActive: 0 });
      await storage.deleteUserSessions(userId);

      await writeAuditLog(auditFromRequest(req, {
        action: AuditAction.ADMIN_USER_DEACTIVATED,
        resourceType: "admin_user",
        resourceId: String(userId),
        outcome: "success",
        details: { targetEmail: user.email },
      }));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to deactivate user" });
    }
  });
  // ---------------------------------------------------------------
  // AMBIENT AI -- Call Sessions
  // ---------------------------------------------------------------

  // Get service configuration status
  app.get("/api/admin/ambient/config", adminAuth, requirePermission(Permission.VIEW_CALLS), async (_req, res) => {
    res.json({
      success: true,
      transcriptionAvailable: isTranscriptionConfigured(),
      soapGenerationAvailable: isSoapGenerationConfigured(),
    });
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

      await storage.updateCallSession(id, {
        callEndedAt,
        durationSeconds,
        status: "transcribing",
      });

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

      // Accept either raw audio upload or manual transcript text
      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        // Manual transcript
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
        // Audio upload -- collect raw body
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
        return; // Response handled in event listener
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
      if (!session) {
        return res.status(404).json({ success: false, message: "Call session not found" });
      }

      const transcript = await storage.getTranscriptByCallSession(id);
      if (!transcript) {
        return res.status(400).json({ success: false, message: "No transcript found. Transcribe the call first." });
      }

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
      const schema = z.object({
        subjective: z.string(),
        objective: z.string(),
        assessment: z.string(),
        plan: z.string(),
      });
      const validated = schema.parse(req.body);

      const soapNote = await storage.getSoapNoteByCallSession(callId);
      if (!soapNote) {
        return res.status(404).json({ success: false, message: "SOAP note not found" });
      }

      await storage.updateSoapNote(soapNote.id, {
        subjective: validated.subjective,
        objective: validated.objective,
        assessment: validated.assessment,
        plan: validated.plan,
        status: "reviewed",
        reviewedBy: req.adminUser!.id,
        reviewedAt: new Date(),
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid SOAP note data", errors: error.errors });
      }
      console.error("Update SOAP note error:", error);
      res.status(500).json({ success: false, message: "Failed to update SOAP note" });
    }
  });

  // Sign SOAP note (finalize)
  app.put("/api/admin/calls/:id/sign", adminAuth, requirePermission(Permission.MANAGE_CALLS), async (req, res) => {
    try {
      const callId = parseInt(req.params.id);
      const soapNote = await storage.getSoapNoteByCallSession(callId);
      if (!soapNote) {
        return res.status(404).json({ success: false, message: "SOAP note not found" });
      }

      await storage.updateSoapNote(soapNote.id, {
        status: "signed",
        signedBy: req.adminUser!.id,
        signedAt: new Date(),
      });

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

  // List time entries
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

  // Create time entry (manual or auto from call)
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid time entry data", errors: error.errors });
      }
      console.error("Create time entry error:", error);
      res.status(500).json({ success: false, message: "Failed to create time entry" });
    }
  });

  // Delete time entry
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

  // Time tracking summary report
  app.get("/api/admin/time-entries/report", adminAuth, requirePermission(Permission.VIEW_TIME_ENTRIES), async (req, res) => {
    try {
      const entries = await storage.getTimeEntries({
        clinicianId: req.query.clinicianId ? parseInt(req.query.clinicianId as string) : undefined,
        practiceId: req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined,
        programType: req.query.programType as string | undefined,
      });

      // Aggregate by program type and date
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

      res.json({
        success: true,
        totalMinutes,
        totalEntries: entries.length,
        byProgram,
        byDate,
      });
    } catch (error) {
      console.error("Time report error:", error);
      res.status(500).json({ success: false, message: "Failed to generate time report" });
    }
  });
}

// ================================================================
// Admin seed (uses env var for password -- never hardcoded)
// ================================================================

export async function seedAdminUsers() {
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    console.log("[Admin] ADMIN_DEFAULT_PASSWORD not set - skipping admin seed. Set this env var to create initial admin accounts.");
    return;
  }

  if (defaultPassword.length < 12) {
    console.warn("[Admin] ADMIN_DEFAULT_PASSWORD should be at least 12 characters for security.");
  }

  const admins = [
    { email: "alexander.barrett@lynkhealthcare.com", name: "Alexander Barrett", role: "superadmin" as const },
    { email: "will.moon@lynkhealthcare.com", name: "Will Moon", role: "admin" as const },
  ];

  for (const admin of admins) {
    const existing = await storage.getAdminUserByEmail(admin.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(defaultPassword, 12);
      await storage.createAdminUser({
        email: admin.email,
        name: admin.name,
        passwordHash,
        role: admin.role,
      });
      console.log(`[Admin] Created ${admin.role} account: ${admin.email}`);
    }
  }
}
