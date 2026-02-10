import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { adminAuth } from "./admin-routes";
import {
  insertPatientSchema, insertPatientConditionSchema, insertPatientMedicationSchema,
  insertPatientAllergySchema, insertPatientVitalSchema, insertPatientInsuranceSchema,
  insertProgramEnrollmentSchema, insertCarePlanSchema, insertCarePlanItemSchema,
  insertTimeLogSchema, insertClinicalTaskSchema, insertPatientAssessmentSchema,
  insertCalendarEventSchema, insertClaimSchema,
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
  // Clinical Tasks
  // ============================================================

  app.get("/api/clinical/tasks", adminAuth, async (req, res) => {
    try {
      const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;
      const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
      const tasks = await storage.getTasks(assignedTo, patientId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });

  app.post("/api/clinical/tasks", adminAuth, async (req, res) => {
    try {
      const data = insertClinicalTaskSchema.parse(req.body);
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
  // Calendar Events
  // ============================================================

  app.get("/api/clinical/events", adminAuth, async (req, res) => {
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

  app.post("/api/clinical/events", adminAuth, async (req, res) => {
    try {
      const data = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
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

  app.put("/api/admin/users/:id", adminAuth, async (req, res) => {
    try {
      const user = await storage.updateAdminUser(parseInt(req.params.id), req.body);
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
      const month = req.query.month as string;
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
      const month = req.query.month as string;
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

  app.get("/api/admin/trends/revenue", adminAuth, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const now = new Date();
      const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const series: Array<{ month: string; year: number; totalRevenue: number; totalClaims: number }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = MONTHS[d.getMonth()];
        const year = d.getFullYear();
        const snapshots = await storage.getRevenueSnapshots(month, year);
        const filtered = practiceId ? snapshots.filter(s => s.practiceId === practiceId && !s.department) : snapshots.filter(s => !s.department);
        const totalRevenue = filtered.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
        const totalClaims = filtered.reduce((sum, s) => sum + (s.claimCount || 0), 0);
        series.push({ month, year, totalRevenue, totalClaims });
      }

      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Failed to get revenue trends" });
    }
  });

  app.get("/api/admin/trends/enrollments", adminAuth, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const practiceId = req.query.practiceId ? parseInt(req.query.practiceId as string) : undefined;
      const now = new Date();
      const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const series: Array<{ month: string; year: number; enrolled: number; inactive: number }> = [];

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = MONTHS[d.getMonth()];
        const year = d.getFullYear();
        const snapshots = await storage.getAggregatedSnapshots(month, year);
        const filtered = practiceId ? snapshots.filter(s => s.practiceId === practiceId && !s.department) : snapshots.filter(s => !s.department);
        const enrolled = filtered.reduce((sum, s) => sum + (s.patientsEnrolled || 0), 0);
        const inactive = filtered.reduce((sum, s) => sum + (s.inactive || 0), 0);
        series.push({ month, year, enrolled, inactive });
      }

      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Failed to get enrollment trends" });
    }
  });
}
