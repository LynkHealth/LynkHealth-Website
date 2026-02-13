import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { storage } from "./storage";
import { adminAuth, requireRole } from "./admin-routes";
import bcrypt from "bcryptjs";
import {
  insertPatientSchema, insertPatientConditionSchema, insertPatientMedicationSchema,
  insertPatientAllergySchema, insertPatientVitalSchema, insertPatientInsuranceSchema,
  insertProgramEnrollmentSchema, insertCarePlanSchema, insertCarePlanItemSchema,
  insertTimeLogSchema, insertClinicalTaskSchema, insertPatientAssessmentSchema,
  insertCalendarEventSchema, insertClaimSchema,
  insertCarePlanTemplateSchema, insertCarePlanTemplateItemSchema,
  insertPoorEngagementFormSchema,
  insertBillingEvaluationFormSchema,
} from "@shared/schema";
import { z } from "zod";


export function registerClinicalRoutes(app: Express) {

  // ============================================================
  // Patients
  // ============================================================

  app.get("/api/clinical/patients", adminAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const search = req.query.search as string | undefined;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const result = await storage.listPatients(practiceId, search, page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error listing patients:", error);
      res.status(500).json({ error: "Failed to list patients" });
    }
  });

  app.get("/api/clinical/patients/:id", adminAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to get patient" });
    }
  });

  app.post("/api/clinical/patients", adminAuth, async (req, res) => {
    try {
      const data = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(data);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create patient" });
    }
  });

  app.put("/api/clinical/patients/:id", adminAuth, async (req, res) => {
    try {
      const patient = await storage.updatePatient(parseInt(req.params.id), req.body);
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to update patient" });
    }
  });

  app.delete("/api/clinical/patients/:id", adminAuth, async (req, res) => {
    try {
      await storage.deletePatient(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete patient" });
    }
  });

  // ============================================================
  // Patient Conditions
  // ============================================================

  app.get("/api/clinical/patients/:id/conditions", adminAuth, async (req, res) => {
    try {
      const conditions = await storage.getPatientConditions(parseInt(req.params.id));
      res.json(conditions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conditions" });
    }
  });

  app.post("/api/clinical/patients/:id/conditions", adminAuth, async (req, res) => {
    try {
      const data = insertPatientConditionSchema.parse({ ...req.body, patientId: parseInt(req.params.id) });
      const condition = await storage.createPatientCondition(data);
      res.status(201).json(condition);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create condition" });
    }
  });

  app.delete("/api/clinical/conditions/:id", adminAuth, async (req, res) => {
    try {
      await storage.deletePatientCondition(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete condition" });
    }
  });

  // ============================================================
  // Patient Medications
  // ============================================================

  app.get("/api/clinical/patients/:id/medications", adminAuth, async (req, res) => {
    try {
      const medications = await storage.getPatientMedications(parseInt(req.params.id));
      res.json(medications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get medications" });
    }
  });

  app.post("/api/clinical/patients/:id/medications", adminAuth, async (req, res) => {
    try {
      const data = insertPatientMedicationSchema.parse({ ...req.body, patientId: parseInt(req.params.id) });
      const medication = await storage.createPatientMedication(data);
      res.status(201).json(medication);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create medication" });
    }
  });

  app.put("/api/clinical/medications/:id", adminAuth, async (req, res) => {
    try {
      const medication = await storage.updatePatientMedication(parseInt(req.params.id), req.body);
      if (!medication) return res.status(404).json({ error: "Medication not found" });
      res.json(medication);
    } catch (error) {
      res.status(500).json({ error: "Failed to update medication" });
    }
  });

  app.delete("/api/clinical/medications/:id", adminAuth, async (req, res) => {
    try {
      await storage.deletePatientMedication(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete medication" });
    }
  });

  // ============================================================
  // Patient Allergies
  // ============================================================

  app.get("/api/clinical/patients/:id/allergies", adminAuth, async (req, res) => {
    try {
      const allergies = await storage.getPatientAllergies(parseInt(req.params.id));
      res.json(allergies);
    } catch (error) {
      res.status(500).json({ error: "Failed to get allergies" });
    }
  });

  app.post("/api/clinical/patients/:id/allergies", adminAuth, async (req, res) => {
    try {
      const data = insertPatientAllergySchema.parse({ ...req.body, patientId: parseInt(req.params.id) });
      const allergy = await storage.createPatientAllergy(data);
      res.status(201).json(allergy);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create allergy" });
    }
  });

  app.delete("/api/clinical/allergies/:id", adminAuth, async (req, res) => {
    try {
      await storage.deletePatientAllergy(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete allergy" });
    }
  });

  // ============================================================
  // Patient Vitals
  // ============================================================

  app.get("/api/clinical/patients/:id/vitals", adminAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const vitals = await storage.getPatientVitals(parseInt(req.params.id), limit);
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vitals" });
    }
  });

  app.post("/api/clinical/patients/:id/vitals", adminAuth, async (req, res) => {
    try {
      const data = insertPatientVitalSchema.parse({ ...req.body, patientId: parseInt(req.params.id) });
      const vital = await storage.createPatientVital(data);
      res.status(201).json(vital);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create vital" });
    }
  });

  // ============================================================
  // Patient Insurance
  // ============================================================

  app.get("/api/clinical/patients/:id/insurance", adminAuth, async (req, res) => {
    try {
      const insurance = await storage.getPatientInsurance(parseInt(req.params.id));
      res.json(insurance);
    } catch (error) {
      res.status(500).json({ error: "Failed to get insurance" });
    }
  });

  app.post("/api/clinical/patients/:id/insurance", adminAuth, async (req, res) => {
    try {
      const data = insertPatientInsuranceSchema.parse({ ...req.body, patientId: parseInt(req.params.id) });
      const insurance = await storage.createPatientInsurance(data);
      res.status(201).json(insurance);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create insurance" });
    }
  });

  app.put("/api/clinical/insurance/:id", adminAuth, async (req, res) => {
    try {
      const insurance = await storage.updatePatientInsurance(parseInt(req.params.id), req.body);
      if (!insurance) return res.status(404).json({ error: "Insurance not found" });
      res.json(insurance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update insurance" });
    }
  });

  app.delete("/api/clinical/insurance/:id", adminAuth, async (req, res) => {
    try {
      await storage.deletePatientInsurance(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete insurance" });
    }
  });

  // ============================================================
  // Program Enrollments
  // ============================================================

  app.get("/api/clinical/patients/:id/enrollments", adminAuth, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments(parseInt(req.params.id));
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get enrollments" });
    }
  });

  app.get("/api/clinical/worklist/:programType", adminAuth, async (req, res) => {
    try {
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const enrollments = await storage.getEnrollmentsByProgram(req.params.programType, practiceId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get worklist" });
    }
  });

  app.get("/api/clinical/worklists", adminAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const programType = req.query.programType as string | undefined;
      const status = (req.query.status as string) || "active";
      const search = req.query.search as string | undefined;

      const allEnrollments = await storage.getEnrollments();
      let filtered = allEnrollments.filter((e: any) => e.status === status);
      if (programType) filtered = filtered.filter((e: any) => e.programType === programType);

      const worklistItems = await Promise.all(
        filtered.map(async (enrollment: any) => {
          try {
            const patient = await storage.getPatient(enrollment.patientId);
            if (!patient) return null;
            return { enrollment, patient };
          } catch { return null; }
        })
      );

      let items = worklistItems.filter(Boolean) as any[];

      if (search) {
        const s = search.toLowerCase();
        items = items.filter((item: any) =>
          item.patient.firstName?.toLowerCase().includes(s) ||
          item.patient.lastName?.toLowerCase().includes(s) ||
          item.patient.mrn?.toLowerCase().includes(s)
        );
      }

      const total = items.length;
      const offset = (page - 1) * limit;
      const paged = items.slice(offset, offset + limit);

      res.json({ worklist: paged, total });
    } catch (error) {
      console.error("Worklist error:", error);
      res.status(500).json({ error: "Failed to get worklist" });
    }
  });

  app.post("/api/clinical/enrollments", adminAuth, async (req, res) => {
    try {
      const data = insertProgramEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(data);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create enrollment" });
    }
  });

  app.put("/api/clinical/enrollments/:id", adminAuth, async (req, res) => {
    try {
      const enrollment = await storage.updateEnrollment(parseInt(req.params.id), req.body);
      if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update enrollment" });
    }
  });

  // ============================================================
  // Care Plans
  // ============================================================

  app.get("/api/clinical/patients/:id/care-plans", adminAuth, async (req, res) => {
    try {
      const plans = await storage.getCarePlans(parseInt(req.params.id));
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to get care plans" });
    }
  });

  app.get("/api/clinical/care-plans/:id", adminAuth, async (req, res) => {
    try {
      const plan = await storage.getCarePlan(parseInt(req.params.id));
      if (!plan) return res.status(404).json({ error: "Care plan not found" });
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to get care plan" });
    }
  });

  app.post("/api/clinical/care-plans", adminAuth, async (req, res) => {
    try {
      const data = insertCarePlanSchema.parse(req.body);
      const plan = await storage.createCarePlan(data);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create care plan" });
    }
  });

  app.put("/api/clinical/care-plans/:id", adminAuth, async (req, res) => {
    try {
      const plan = await storage.updateCarePlan(parseInt(req.params.id), req.body);
      if (!plan) return res.status(404).json({ error: "Care plan not found" });
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update care plan" });
    }
  });

  // ============================================================
  // Care Plan Items
  // ============================================================

  app.get("/api/clinical/care-plans/:id/items", adminAuth, async (req, res) => {
    try {
      const items = await storage.getCarePlanItems(parseInt(req.params.id));
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get care plan items" });
    }
  });

  app.post("/api/clinical/care-plan-items", adminAuth, async (req, res) => {
    try {
      const data = insertCarePlanItemSchema.parse(req.body);
      const item = await storage.createCarePlanItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create care plan item" });
    }
  });

  app.put("/api/clinical/care-plan-items/:id", adminAuth, async (req, res) => {
    try {
      const item = await storage.updateCarePlanItem(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: "Care plan item not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update care plan item" });
    }
  });

  app.delete("/api/clinical/care-plan-items/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteCarePlanItem(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete care plan item" });
    }
  });

  // ============================================================
  // Time Logs
  // ============================================================

  app.get("/api/clinical/patients/:id/time-logs", adminAuth, async (req, res) => {
    try {
      const logs = await storage.getTimeLogs(parseInt(req.params.id));
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get time logs" });
    }
  });

  app.get("/api/clinical/patients/:id/time-summary", adminAuth, async (req, res) => {
    try {
      const programType = req.query.programType as string;
      const month = req.query.month as string;
      const year = parseInt(req.query.year as string);
      if (!programType || !month || !year) {
        return res.status(400).json({ error: "programType, month, and year are required" });
      }
      const summary = await storage.getTimeLogSummary(parseInt(req.params.id), programType, month, year);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to get time summary" });
    }
  });

  app.post("/api/clinical/time-logs", adminAuth, async (req, res) => {
    try {
      const data = insertTimeLogSchema.parse(req.body);
      const log = await storage.createTimeLog(data);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create time log" });
    }
  });

  // ============================================================
  // Patient Assessments
  // ============================================================

  app.get("/api/clinical/patients/:id/assessments", adminAuth, async (req, res) => {
    try {
      const assessments = await storage.getAssessments(parseInt(req.params.id));
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get assessments" });
    }
  });

  app.post("/api/clinical/assessments", adminAuth, async (req, res) => {
    try {
      const data = insertPatientAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(data);
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create assessment" });
    }
  });

  // ============================================================
  // Claims
  // ============================================================

  app.get("/api/clinical/claims", adminAuth, async (req, res) => {
    try {
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const programType = req.query.programType as string | undefined;
      const status = req.query.status as string | undefined;
      const claimsList = await storage.getClaims(practiceId, programType, status);
      res.json(claimsList);
    } catch (error) {
      res.status(500).json({ error: "Failed to get claims" });
    }
  });

  app.post("/api/clinical/claims", adminAuth, async (req, res) => {
    try {
      const data = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(data);
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create claim" });
    }
  });

  app.put("/api/clinical/claims/:id", adminAuth, async (req, res) => {
    try {
      const claim = await storage.updateClaim(parseInt(req.params.id), req.body);
      if (!claim) return res.status(404).json({ error: "Claim not found" });
      res.json(claim);
    } catch (error) {
      res.status(500).json({ error: "Failed to update claim" });
    }
  });

  // ============================================================
  // Admin User Management
  // ============================================================

  app.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users = await storage.getAdminUsers();
      res.json(users.map(u => ({ ...u, passwordHash: undefined })));
    } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.post("/api/admin/users", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const { email, password, role, name } = req.body;
      if (!email || !password || !name) return res.status(400).json({ error: "Email, name, and password required" });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createAdminUser({ email, passwordHash, role: role || "care_manager", name });
      res.status(201).json({ ...user, passwordHash: undefined });
    } catch (error: any) {
      if (error.message?.includes("duplicate") || error.code === "23505") return res.status(409).json({ error: "Email already exists" });
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const updates: any = { ...req.body };
      if (updates.password) {
        updates.passwordHash = await bcrypt.hash(updates.password, 10);
        delete updates.password;
      }
      const user = await storage.updateAdminUser(parseInt(req.params.id), updates);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ ...user, passwordHash: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // ============================================================
  // CSV Export
  // ============================================================

  app.get("/api/admin/export/revenue", adminAuth, async (req, res) => {
    try {
      let month = (req.query.month as string || "").toUpperCase();
      const FULL_TO_ABBREV: Record<string, string> = { JANUARY: "JAN", FEBRUARY: "FEB", MARCH: "MAR", APRIL: "APR", MAY: "MAY", JUNE: "JUN", JULY: "JUL", AUGUST: "AUG", SEPTEMBER: "SEP", OCTOBER: "OCT", NOVEMBER: "NOV", DECEMBER: "DEC" };
      if (FULL_TO_ABBREV[month]) month = FULL_TO_ABBREV[month];
      const year = parseInt(req.query.year as string);
      if (!month || !year) return res.status(400).json({ error: "month and year required" });
      const revenue = await storage.getRevenueSnapshots(month, year);
      const csv = ["Practice ID,Department,Program,Claims,Concatenated,Non-Concatenated,Revenue (cents)"];
      revenue.forEach(r => {
        csv.push(`${r.practiceId},${r.department || ""},${r.programType},${r.claimCount},${r.concatenatedCount},${r.nonConcatenatedCount},${r.totalRevenue}`);
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=revenue_${month}_${year}.csv`);
      res.send(csv.join("\n"));
    } catch (error) {
      res.status(500).json({ error: "Failed to export revenue" });
    }
  });

  app.get("/api/admin/export/enrollments", adminAuth, async (req, res) => {
    try {
      let month = (req.query.month as string || "").toUpperCase();
      const FULL_TO_ABBREV: Record<string, string> = { JANUARY: "JAN", FEBRUARY: "FEB", MARCH: "MAR", APRIL: "APR", MAY: "MAY", JUNE: "JUN", JULY: "JUL", AUGUST: "AUG", SEPTEMBER: "SEP", OCTOBER: "OCT", NOVEMBER: "NOV", DECEMBER: "DEC" };
      if (FULL_TO_ABBREV[month]) month = FULL_TO_ABBREV[month];
      const year = parseInt(req.query.year as string);
      if (!month || !year) return res.status(400).json({ error: "month and year required" });
      const snapshots = await storage.getAggregatedSnapshots(month, year);
      const csv = ["Practice ID,Department,Program,Enrolled,Not Enrolled,Inactive"];
      snapshots.forEach(s => {
        csv.push(`${s.practiceId},${s.department || ""},${s.programType},${s.patientsEnrolled},${s.notEnrolled},${s.inactive}`);
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=enrollments_${month}_${year}.csv`);
      res.send(csv.join("\n"));
    } catch (error) {
      res.status(500).json({ error: "Failed to export enrollments" });
    }
  });

  // ============================================================
  // Analytics Trend Data
  // ============================================================

  const getLynkPracticeId = async () => {
    const allPractices = await storage.getPractices();
    return allPractices.find(p => p.name.toLowerCase() === "your clinic")?.id;
  };

  const filterRevenueSnapshots = (snapshots: any[], practiceId?: number, department?: string, lynkId?: number) => {
    if (department) {
      return snapshots.filter(s => s.practiceId === practiceId && s.department === department);
    }
    if (practiceId) {
      return snapshots.filter(s => s.practiceId === practiceId && !s.department);
    }
    return snapshots.filter(s => {
      if (lynkId && s.practiceId === lynkId) return !!s.department;
      return !s.department;
    });
  };

  const filterProgramSnapshots = (snapshots: any[], practiceId?: number, department?: string, lynkId?: number) => {
    if (department) {
      return snapshots.filter(s => s.practiceId === practiceId && s.department === department);
    }
    if (practiceId) {
      return snapshots.filter(s => s.practiceId === practiceId && !s.department);
    }
    return snapshots.filter(s => {
      if (lynkId && s.practiceId === lynkId) return !!s.department;
      return !s.department;
    });
  };

  app.get("/api/admin/trends/revenue", adminAuth, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const department = req.query.department as string | undefined;
      const lynkId = await getLynkPracticeId();
      const now = new Date();
      const MONTH_ABBREVS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const series: Array<{ month: string; year: number; totalRevenue: number; totalClaims: number }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = MONTH_ABBREVS[d.getMonth()];
        const year = d.getFullYear();
        const snapshots = await storage.getRevenueSnapshots(month, year);
        const filtered = filterRevenueSnapshots(snapshots, practiceId, department, lynkId);
        const totalRevenue = filtered.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
        const totalClaims = filtered.reduce((sum, s) => sum + (s.claimCount || 0), 0);
        series.push({ month, year, totalRevenue, totalClaims });
      }

      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Failed to get revenue trends" });
    }
  });

  app.get("/api/admin/trends/revenue-by-program", adminAuth, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const department = req.query.department as string | undefined;
      const lynkId = await getLynkPracticeId();
      const now = new Date();
      const MONTH_ABBREVS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const series: Array<{ month: string; year: number; CCM: number; RPM: number; BHI: number; PCM: number; RTM: number; APCM: number; OTHER: number }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = MONTH_ABBREVS[d.getMonth()];
        const year = d.getFullYear();
        const snapshots = await storage.getRevenueSnapshots(month, year);
        const filtered = filterRevenueSnapshots(snapshots, practiceId, department, lynkId);
        const byProgram: Record<string, number> = { CCM: 0, RPM: 0, BHI: 0, PCM: 0, RTM: 0, APCM: 0, OTHER: 0 };
        filtered.forEach(s => {
          const key = byProgram.hasOwnProperty(s.programType) ? s.programType : "OTHER";
          byProgram[key] += s.totalRevenue || 0;
        });
        series.push({ month, year, ...byProgram } as any);
      }

      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Failed to get revenue by program" });
    }
  });

  app.get("/api/admin/trends/practice-comparison", adminAuth, async (req, res) => {
    try {
      const month = req.query.month as string;
      const year = parseInt(req.query.year as string);
      if (!month || !year) return res.status(400).json({ error: "month and year required" });
      const allRevenue = await storage.getRevenueSnapshots(month, year);
      const allSnapshots = await storage.getAggregatedSnapshots(month, year);
      const allPractices = await storage.getPractices();
      const practiceMap = new Map(allPractices.map(p => [p.id, p.name]));

      const lynkPractice = allPractices.find(p => p.name.toLowerCase() === "your clinic");
      const lynkId = lynkPractice?.id;

      const practiceData: Record<string, { practiceId: number; department?: string; name: string; revenue: number; claims: number; enrolled: number }> = {};

      allRevenue.forEach(s => {
        if (s.practiceId === lynkId && s.department) {
          const key = `${s.practiceId}:${s.department}`;
          if (!practiceData[key]) practiceData[key] = { practiceId: s.practiceId, department: s.department, name: s.department, revenue: 0, claims: 0, enrolled: 0 };
          practiceData[key].revenue += s.totalRevenue || 0;
          practiceData[key].claims += s.claimCount || 0;
        } else if (s.practiceId !== lynkId && !s.department) {
          const key = `${s.practiceId}`;
          if (!practiceData[key]) practiceData[key] = { practiceId: s.practiceId, name: practiceMap.get(s.practiceId) || `Practice ${s.practiceId}`, revenue: 0, claims: 0, enrolled: 0 };
          practiceData[key].revenue += s.totalRevenue || 0;
          practiceData[key].claims += s.claimCount || 0;
        }
      });
      allSnapshots.forEach(s => {
        if (s.practiceId === lynkId && s.department) {
          const key = `${s.practiceId}:${s.department}`;
          if (!practiceData[key]) practiceData[key] = { practiceId: s.practiceId, department: s.department, name: s.department, revenue: 0, claims: 0, enrolled: 0 };
          practiceData[key].enrolled += s.patientsEnrolled || 0;
        } else if (s.practiceId !== lynkId && !s.department) {
          const key = `${s.practiceId}`;
          if (!practiceData[key]) practiceData[key] = { practiceId: s.practiceId, name: practiceMap.get(s.practiceId) || `Practice ${s.practiceId}`, revenue: 0, claims: 0, enrolled: 0 };
          practiceData[key].enrolled += s.patientsEnrolled || 0;
        }
      });

      res.json(Object.values(practiceData).sort((a, b) => b.revenue - a.revenue));
    } catch (error) {
      res.status(500).json({ error: "Failed to get practice comparison" });
    }
  });

  // ============================================================
  // Dashboard
  // ============================================================

  app.get("/api/clinical/dashboard/stats", adminAuth, async (req: any, res) => {
    try {
      const userId = req.adminUser?.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  app.get("/api/clinical/dashboard/recent-tasks", adminAuth, async (req: any, res) => {
    try {
      const userId = req.adminUser?.id;
      const tasks = await storage.getTasks(userId);
      res.json(tasks.slice(0, 20));
    } catch (error) {
      res.status(500).json({ error: "Failed to get recent tasks" });
    }
  });

  app.get("/api/clinical/dashboard/upcoming-events", adminAuth, async (req: any, res) => {
    try {
      const userId = req.adminUser?.id;
      const now = new Date();
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
      const events = await storage.getEvents(userId, now, endOfWeek);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to get upcoming events" });
    }
  });

  // ============================================================
  // Tasks CRUD (full)
  // ============================================================

  app.get("/api/clinical/tasks", adminAuth, async (req: any, res) => {
    try {
      const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      const tasks = await storage.getTasks(assignedTo, patientId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });

  app.post("/api/clinical/tasks", adminAuth, async (req: any, res) => {
    try {
      const data = insertClinicalTaskSchema.parse({ ...req.body, createdBy: req.adminUser?.id || req.body.createdBy });
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.put("/api/clinical/tasks/:id", adminAuth, async (req, res) => {
    try {
      const task = await storage.updateTask(parseInt(req.params.id), req.body);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/clinical/tasks/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteTask(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ============================================================
  // Calendar Events CRUD (full)
  // ============================================================

  app.get("/api/clinical/events", adminAuth, async (req: any, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const events = await storage.getEvents(userId, startDate, endDate);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to get events" });
    }
  });

  app.post("/api/clinical/events", adminAuth, async (req: any, res) => {
    try {
      const data = insertCalendarEventSchema.parse({ ...req.body, userId: req.adminUser?.id || req.body.userId });
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      console.error("Create event error:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/clinical/events/:id", adminAuth, async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/clinical/events/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // ============================================================
  // Care Plan Templates
  // ============================================================

  app.get("/api/clinical/templates", adminAuth, async (req, res) => {
    try {
      const programType = req.query.programType as string | undefined;
      const templates = await storage.getCarePlanTemplates(programType);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get templates" });
    }
  });

  app.get("/api/clinical/templates/:id", adminAuth, async (req, res) => {
    try {
      const template = await storage.getCarePlanTemplate(parseInt(req.params.id));
      if (!template) return res.status(404).json({ error: "Template not found" });
      const items = await storage.getCarePlanTemplateItems(template.id);
      res.json({ ...template, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to get template" });
    }
  });

  app.post("/api/clinical/templates", adminAuth, requireRole("admin", "supervisor"), async (req: any, res) => {
    try {
      const { items, ...templateData } = req.body;
      const data = insertCarePlanTemplateSchema.parse({ ...templateData, createdBy: req.adminUser?.id || templateData.createdBy });
      const template = await storage.createCarePlanTemplate(data);
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await storage.createCarePlanTemplateItem({ ...item, templateId: template.id });
        }
      }
      const savedItems = await storage.getCarePlanTemplateItems(template.id);
      res.status(201).json({ ...template, items: savedItems });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      console.error("Create template error:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.put("/api/clinical/templates/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const { items, ...updates } = req.body;
      const template = await storage.updateCarePlanTemplate(parseInt(req.params.id), updates);
      if (!template) return res.status(404).json({ error: "Template not found" });
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/clinical/templates/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      await storage.deleteCarePlanTemplate(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.post("/api/clinical/templates/:id/items", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const data = insertCarePlanTemplateItemSchema.parse({ ...req.body, templateId: parseInt(req.params.id) });
      const item = await storage.createCarePlanTemplateItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create template item" });
    }
  });

  app.delete("/api/clinical/template-items/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      await storage.deleteCarePlanTemplateItem(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete template item" });
    }
  });

  app.post("/api/clinical/templates/:id/apply", adminAuth, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const { patientId, enrollmentId } = req.body;
      if (!patientId || !enrollmentId) return res.status(400).json({ error: "patientId and enrollmentId required" });

      const template = await storage.getCarePlanTemplate(templateId);
      if (!template) return res.status(404).json({ error: "Template not found" });

      const items = await storage.getCarePlanTemplateItems(templateId);
      const carePlan = await storage.createCarePlan({
        patientId,
        enrollmentId,
        title: template.name,
        status: "active",
      });

      for (const item of items) {
        await storage.createCarePlanItem({
          carePlanId: carePlan.id,
          itemType: item.itemType,
          description: item.description,
          status: "active",
        });
      }

      const planItems = await storage.getCarePlanItems(carePlan.id);
      res.status(201).json({ ...carePlan, items: planItems });
    } catch (error) {
      console.error("Apply template error:", error);
      res.status(500).json({ error: "Failed to apply template" });
    }
  });

  app.get("/api/admin/trends/enrollments", adminAuth, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const department = req.query.department as string | undefined;
      const lynkId = await getLynkPracticeId();
      const now = new Date();
      const MONTH_ABBREVS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const series: Array<{ month: string; year: number; enrolled: number; inactive: number }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = MONTH_ABBREVS[d.getMonth()];
        const year = d.getFullYear();
        const snapshots = await storage.getAggregatedSnapshots(month, year);
        const filtered = filterProgramSnapshots(snapshots, practiceId, department, lynkId);
        const enrolled = filtered.reduce((sum, s) => sum + (s.patientsEnrolled || 0), 0);
        const inactive = filtered.reduce((sum, s) => sum + (s.inactive || 0), 0);
        series.push({ month, year, enrolled, inactive });
      }

      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Failed to get enrollment trends" });
    }
  });

  // ============================================================
  // Poor Engagement Forms
  // ============================================================

  app.post("/api/clinical/forms/poor-engagement", adminAuth, async (req, res) => {
    try {
      const parsed = insertPoorEngagementFormSchema.parse({
        ...req.body,
        status: "pending",
        submittedBy: (req as any).adminUser?.id,
      });
      const form = await storage.createPoorEngagementForm(parsed);
      res.status(201).json(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error submitting poor engagement form:", error);
      res.status(500).json({ error: "Failed to submit form" });
    }
  });

  app.get("/api/clinical/forms/poor-engagement", adminAuth, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const forms = await storage.listPoorEngagementForms(status);
      res.json(forms);
    } catch (error) {
      console.error("Error listing poor engagement forms:", error);
      res.status(500).json({ error: "Failed to list forms" });
    }
  });

  app.patch("/api/clinical/forms/poor-engagement/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }
      const reviewerId = (req as any).adminUser?.id;
      const updated = await storage.updatePoorEngagementFormStatus(id, status, reviewerId, reviewNotes);
      if (!updated) return res.status(404).json({ error: "Form not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating poor engagement form:", error);
      res.status(500).json({ error: "Failed to update form" });
    }
  });

  // ============================================================
  // Billing Evaluation Forms
  // ============================================================

  app.post("/api/clinical/forms/billing-evaluation", adminAuth, async (req, res) => {
    try {
      const parsed = insertBillingEvaluationFormSchema.parse({
        ...req.body,
        status: "pending",
        submittedBy: (req as any).adminUser?.id,
      });
      const form = await storage.createBillingEvaluationForm(parsed);
      res.status(201).json(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error submitting billing evaluation form:", error);
      res.status(500).json({ error: "Failed to submit form" });
    }
  });

  app.get("/api/clinical/forms/billing-evaluation", adminAuth, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const forms = await storage.listBillingEvaluationForms(status);
      res.json(forms);
    } catch (error) {
      console.error("Error listing billing evaluation forms:", error);
      res.status(500).json({ error: "Failed to list forms" });
    }
  });

  app.patch("/api/clinical/forms/billing-evaluation/:id", adminAuth, requireRole("admin", "supervisor"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }
      const reviewerId = (req as any).adminUser?.id;
      const updated = await storage.updateBillingEvaluationFormStatus(id, status, reviewerId, reviewNotes);
      if (!updated) return res.status(404).json({ error: "Form not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating billing evaluation form:", error);
      res.status(500).json({ error: "Failed to update form" });
    }
  });

}
