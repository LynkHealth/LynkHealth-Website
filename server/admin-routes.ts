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
import { writeAuditLog, getAuditLogs, AuditAction, getClientIp } from "./audit";
import { requirePermission, Permission, hasPermission } from "./rbac";

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

      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
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
