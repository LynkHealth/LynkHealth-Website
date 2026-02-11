import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { adminLoginSchema, cptBillingCodes } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { runFullSync, runHistoricalSync, runRevenueSync, runHistoricalRevenueSync, getSyncStatus } from "./thoroughcare-sync";
import { testConnection } from "./thoroughcare-client";
import { db } from "./db";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      adminUser?: { id: number; email: string; name: string; role: string };
    }
  }
}

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.admin_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const session = await storage.getAdminSession(token);
  if (!session) {
    return res.status(401).json({ success: false, message: "Session expired" });
  }
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    await storage.deleteAdminSession(token);
    return res.status(401).json({ success: false, message: "Session expired" });
  }
  const { db } = await import("./db");
  const { adminUsers } = await import("@shared/schema");
  const { eq } = await import("drizzle-orm");
  const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.id, session.userId));
  if (!adminUser) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
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
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = adminLoginSchema.parse(req.body);
      const user = await storage.getAdminUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      const token = crypto.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await storage.createAdminSession(user.id, token, expiresAt);
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
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      await storage.deleteAdminSession(token);
    }
    res.json({ success: true });
  });

  app.get("/api/admin/me", adminAuth, async (req, res) => {
    res.json({ success: true, user: req.adminUser });
  });

  app.get("/api/admin/dashboard", adminAuth, async (req, res) => {
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

  app.get("/api/admin/practices", adminAuth, async (req, res) => {
    try {
      const practices = await storage.getPractices();
      res.json({ success: true, practices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load practices" });
    }
  });

  app.post("/api/admin/practices", adminAuth, async (req, res) => {
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

  app.get("/api/admin/snapshots", adminAuth, async (req, res) => {
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

  app.get("/api/admin/inquiries", adminAuth, async (req, res) => {
    try {
      const contactInquiries = await storage.getContactInquiries();
      const nightInquiries = await storage.getNightCoverageInquiries();
      const woundReferrals = await storage.getWoundCareReferrals();
      res.json({ success: true, contactInquiries, nightInquiries, woundReferrals });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to load inquiries" });
    }
  });

  app.get("/api/admin/tc/status", adminAuth, async (_req, res) => {
    try {
      const syncStatus = getSyncStatus();
      res.json({ success: true, ...syncStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get sync status" });
    }
  });

  app.post("/api/admin/tc/sync", adminAuth, async (req, res) => {
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

  app.post("/api/admin/tc/sync-historical", adminAuth, async (req, res) => {
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

  app.post("/api/admin/tc/sync-revenue", adminAuth, async (req, res) => {
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

  app.post("/api/admin/tc/sync-revenue-historical", adminAuth, async (req, res) => {
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

  app.get("/api/admin/tc/test", adminAuth, async (_req, res) => {
    try {
      const result = await testConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Connection test failed" });
    }
  });

  app.get("/api/admin/tc/sample-enrollments", adminAuth, async (_req, res) => {
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
