import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { adminLoginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { runFullSync, runHistoricalSync, getSyncStatus } from "./thoroughcare-sync";
import { testConnection } from "./thoroughcare-client";

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

      res.json({ success: true, snapshots, practices: practicesList, departmentsByPractice, inquiries, month, year });
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
