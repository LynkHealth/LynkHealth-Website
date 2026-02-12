import { users, contactInquiries, nightCoverageInquiries, woundCareReferrals, adminUsers, adminSessions, practices, programSnapshots, revenueSnapshots, revenueByCode, cptBillingCodes, patients, patientConditions, patientMedications, patientAllergies, patientVitals, patientInsurance, programEnrollments, carePlans, carePlanItems, timeLogs, clinicalTasks, patientAssessments, calendarEvents, claims, carePlanTemplates, carePlanTemplateItems, poorEngagementForms, billingEvaluationForms, invoices, invoiceLineItems, auditLogs, loginAttempts, passwordHistory, type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, type NightCoverageInquiry, type InsertNightCoverageInquiry, type WoundCareReferral, type InsertWoundCareReferral, type AdminUser, type InsertAdminUser, type AdminSession, type Practice, type InsertPractice, type ProgramSnapshot, type InsertProgramSnapshot, type RevenueSnapshot, type InsertRevenueSnapshot, type RevenueByCode, type CptBillingCode, type InsertCptBillingCode, type Patient, type InsertPatient, type PatientCondition, type InsertPatientCondition, type PatientMedication, type InsertPatientMedication, type PatientAllergy, type InsertPatientAllergy, type PatientVital, type InsertPatientVital, type PatientInsurance, type InsertPatientInsurance, type ProgramEnrollment, type InsertProgramEnrollment, type CarePlan, type InsertCarePlan, type CarePlanItem, type InsertCarePlanItem, type TimeLog, type InsertTimeLog, type ClinicalTask, type InsertClinicalTask, type PatientAssessment, type InsertPatientAssessment, type CalendarEvent, type InsertCalendarEvent, type Claim, type InsertClaim, type CarePlanTemplate, type InsertCarePlanTemplate, type CarePlanTemplateItem, type InsertCarePlanTemplateItem, type PoorEngagementForm, type InsertPoorEngagementForm, type BillingEvaluationForm, type InsertBillingEvaluationForm, type Invoice, type InsertInvoice, type InvoiceLineItem, type InsertInvoiceLineItem, invoiceRates, type InvoiceRate, type InsertInvoiceRate, tcStaffTimeLogs, type TcStaffTimeLog, type InsertTcStaffTimeLog, type AuditLog, type LoginAttempt, type PasswordHistory } from "@shared/schema";
import { db } from "./db";
import { eq, ne, and, desc, or, ilike, sql, gte, lte, isNull, lt } from "drizzle-orm";
import {
  encryptField, decryptField, hashForSearch,
  getCurrentKeyId, isEncryptionConfigured,
} from "./encryption";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  createNightCoverageInquiry(inquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry>;
  getNightCoverageInquiries(): Promise<NightCoverageInquiry[]>;
  createWoundCareReferral(referral: InsertWoundCareReferral): Promise<WoundCareReferral>;
  getWoundCareReferrals(): Promise<WoundCareReferral[]>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser | undefined>;
  getAdminUsers(): Promise<AdminUser[]>;
  createAdminSession(userId: number, token: string, expiresAt: Date, ipAddress?: string): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
  recordLoginAttempt(email: string, ipAddress: string, success: boolean, failureReason?: string): Promise<void>;
  getRecentFailedAttempts(email: string, minutes: number): Promise<number>;
  addPasswordHistory(userId: number, hash: string): Promise<void>;
  getPasswordHistory(userId: number, limit: number): Promise<PasswordHistory[]>;
  getPractices(): Promise<Practice[]>;
  createPractice(practice: InsertPractice): Promise<Practice>;
  getProgramSnapshots(practiceId?: number, programType?: string, month?: string, year?: number): Promise<ProgramSnapshot[]>;
  createProgramSnapshot(snapshot: InsertProgramSnapshot): Promise<ProgramSnapshot>;
  getAggregatedSnapshots(month: string, year: number): Promise<ProgramSnapshot[]>;
  getRevenueSnapshots(month: string, year: number): Promise<RevenueSnapshot[]>;
  getRevenueByCode(month: string, year: number): Promise<RevenueByCode[]>;
  getCptBillingCodes(effectiveYear?: number): Promise<CptBillingCode[]>;
  getCptBillingCode(id: number): Promise<CptBillingCode | undefined>;
  createCptBillingCode(code: InsertCptBillingCode): Promise<CptBillingCode>;
  updateCptBillingCode(id: number, updates: Partial<InsertCptBillingCode>): Promise<CptBillingCode | undefined>;
  deleteCptBillingCode(id: number): Promise<void>;

  // Patients
  listPatients(practiceId?: number, search?: string, page?: number, limit?: number): Promise<{ patients: Patient[]; total: number }>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: number): Promise<void>;

  // Patient Conditions
  getPatientConditions(patientId: number): Promise<PatientCondition[]>;
  createPatientCondition(condition: InsertPatientCondition): Promise<PatientCondition>;
  deletePatientCondition(id: number): Promise<void>;

  // Patient Medications
  getPatientMedications(patientId: number): Promise<PatientMedication[]>;
  createPatientMedication(medication: InsertPatientMedication): Promise<PatientMedication>;
  updatePatientMedication(id: number, updates: Partial<InsertPatientMedication>): Promise<PatientMedication | undefined>;
  deletePatientMedication(id: number): Promise<void>;

  // Patient Allergies
  getPatientAllergies(patientId: number): Promise<PatientAllergy[]>;
  createPatientAllergy(allergy: InsertPatientAllergy): Promise<PatientAllergy>;
  deletePatientAllergy(id: number): Promise<void>;

  // Patient Vitals
  getPatientVitals(patientId: number, limit?: number): Promise<PatientVital[]>;
  createPatientVital(vital: InsertPatientVital): Promise<PatientVital>;

  // Patient Insurance
  getPatientInsurance(patientId: number): Promise<PatientInsurance[]>;
  createPatientInsurance(insurance: InsertPatientInsurance): Promise<PatientInsurance>;
  updatePatientInsurance(id: number, updates: Partial<InsertPatientInsurance>): Promise<PatientInsurance | undefined>;
  deletePatientInsurance(id: number): Promise<void>;

  // Program Enrollments
  getEnrollments(patientId?: number): Promise<ProgramEnrollment[]>;
  getEnrollmentsByProgram(programType: string, practiceId?: number): Promise<ProgramEnrollment[]>;
  createEnrollment(enrollment: InsertProgramEnrollment): Promise<ProgramEnrollment>;
  updateEnrollment(id: number, updates: Partial<InsertProgramEnrollment>): Promise<ProgramEnrollment | undefined>;

  // Care Plans
  getCarePlans(patientId: number): Promise<CarePlan[]>;
  getCarePlan(id: number): Promise<CarePlan | undefined>;
  createCarePlan(carePlan: InsertCarePlan): Promise<CarePlan>;
  updateCarePlan(id: number, updates: Partial<InsertCarePlan>): Promise<CarePlan | undefined>;

  // Care Plan Items
  getCarePlanItems(carePlanId: number): Promise<CarePlanItem[]>;
  createCarePlanItem(item: InsertCarePlanItem): Promise<CarePlanItem>;
  updateCarePlanItem(id: number, updates: Partial<InsertCarePlanItem>): Promise<CarePlanItem | undefined>;
  deleteCarePlanItem(id: number): Promise<void>;

  // Time Logs
  getTimeLogs(patientId?: number, enrollmentId?: number, userId?: number): Promise<TimeLog[]>;
  createTimeLog(timeLog: InsertTimeLog): Promise<TimeLog>;
  getTimeLogSummary(patientId: number, programType: string, month: string, year: number): Promise<{ totalSeconds: number }>;

  // Clinical Tasks
  getTasks(assignedTo?: number, patientId?: number): Promise<ClinicalTask[]>;
  createTask(task: InsertClinicalTask): Promise<ClinicalTask>;
  updateTask(id: number, updates: Partial<InsertClinicalTask>): Promise<ClinicalTask | undefined>;

  // Patient Assessments
  getAssessments(patientId: number): Promise<PatientAssessment[]>;
  createAssessment(assessment: InsertPatientAssessment): Promise<PatientAssessment>;

  // Calendar Events
  getEvents(userId?: number, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  createEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteEvent(id: number): Promise<void>;

  // Claims
  getClaims(practiceId?: number, programType?: string, status?: string): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: number, updates: Partial<InsertClaim>): Promise<Claim | undefined>;

  // Admin Users
  getAdminUsers(): Promise<AdminUser[]>;
  updateAdminUser(id: number, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;

  // Care Plan Templates
  getCarePlanTemplates(programType?: string): Promise<CarePlanTemplate[]>;
  getCarePlanTemplate(id: number): Promise<CarePlanTemplate | undefined>;
  createCarePlanTemplate(template: InsertCarePlanTemplate): Promise<CarePlanTemplate>;
  updateCarePlanTemplate(id: number, updates: Partial<InsertCarePlanTemplate>): Promise<CarePlanTemplate | undefined>;
  deleteCarePlanTemplate(id: number): Promise<void>;
  getCarePlanTemplateItems(templateId: number): Promise<CarePlanTemplateItem[]>;
  createCarePlanTemplateItem(item: InsertCarePlanTemplateItem): Promise<CarePlanTemplateItem>;
  deleteCarePlanTemplateItem(id: number): Promise<void>;

  // Poor Engagement Forms
  createPoorEngagementForm(form: InsertPoorEngagementForm): Promise<PoorEngagementForm>;
  listPoorEngagementForms(status?: string): Promise<PoorEngagementForm[]>;
  getPoorEngagementForm(id: number): Promise<PoorEngagementForm | undefined>;
  updatePoorEngagementFormStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<PoorEngagementForm | undefined>;

  // Billing Evaluation Forms
  createBillingEvaluationForm(form: InsertBillingEvaluationForm): Promise<BillingEvaluationForm>;
  listBillingEvaluationForms(status?: string): Promise<BillingEvaluationForm[]>;
  getBillingEvaluationForm(id: number): Promise<BillingEvaluationForm | undefined>;
  updateBillingEvaluationFormStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<BillingEvaluationForm | undefined>;

  // Invoice Rates (per-practice)
  getInvoiceRates(year: number, practiceId?: number | null): Promise<InvoiceRate[]>;
  upsertInvoiceRate(rate: InsertInvoiceRate): Promise<InvoiceRate>;
  initInvoiceRatesForPractice(practiceId: number, year: number): Promise<InvoiceRate[]>;

  // Invoices
  generateInvoices(month: string, year: number): Promise<Invoice[]>;
  listInvoices(status?: string, practiceId?: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]>;
  updateInvoiceStatus(id: number, status: string, userId: number, notes?: string): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<void>;

  // Staff Time Logs
  getStaffingReport(month: string, year: number, practiceId?: number, department?: string): Promise<any[]>;
  getStaffRevenueReport(month: string, year: number, practiceId?: number, department?: string): Promise<any[]>;
  clearStaffTimeLogs(month: string, year: number): Promise<void>;

  // Dashboard Aggregates
  getDashboardStats(userId?: number): Promise<{
    totalPatients: number;
    activeEnrollments: number;
    pendingTasks: number;
    todayEvents: number;
    minutesThisMonth: number;
  }>;
  deleteTask(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const encryptedValues = {
      ...insertInquiry,
      firstName: encryptField(insertInquiry.firstName),
      lastName: encryptField(insertInquiry.lastName),
      email: encryptField(insertInquiry.email),
      phone: insertInquiry.phone ? encryptField(insertInquiry.phone) : null,
      message: insertInquiry.message ? encryptField(insertInquiry.message) : null,
      emailHash: hashForSearch(insertInquiry.email),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [inquiry] = await db.insert(contactInquiries).values(encryptedValues).returning();
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const results = await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
    return results.map(r => ({
      ...r,
      firstName: decryptField(r.firstName),
      lastName: decryptField(r.lastName),
      email: decryptField(r.email),
      phone: r.phone ? decryptField(r.phone) : r.phone,
      message: r.message ? decryptField(r.message) : r.message,
    }));
  }

  async createNightCoverageInquiry(insertInquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry> {
    const encryptedValues = {
      ...insertInquiry,
      contactName: encryptField(insertInquiry.contactName),
      email: encryptField(insertInquiry.email),
      phone: insertInquiry.phone ? encryptField(insertInquiry.phone) : null,
      message: insertInquiry.message ? encryptField(insertInquiry.message) : null,
      emailHash: hashForSearch(insertInquiry.email),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [inquiry] = await db.insert(nightCoverageInquiries).values(encryptedValues).returning();
    return inquiry;
  }

  async getNightCoverageInquiries(): Promise<NightCoverageInquiry[]> {
    const results = await db.select().from(nightCoverageInquiries).orderBy(desc(nightCoverageInquiries.createdAt));
    return results.map(r => ({
      ...r,
      contactName: decryptField(r.contactName),
      email: decryptField(r.email),
      phone: r.phone ? decryptField(r.phone) : r.phone,
      message: r.message ? decryptField(r.message) : r.message,
    }));
  }

  async createWoundCareReferral(insertReferral: InsertWoundCareReferral): Promise<WoundCareReferral> {
    const encryptedValues = {
      ...insertReferral,
      providerName: encryptField(insertReferral.providerName),
      email: encryptField(insertReferral.email),
      phone: insertReferral.phone ? encryptField(insertReferral.phone) : null,
      patientName: encryptField(insertReferral.patientName),
      patientDob: encryptField(insertReferral.patientDob),
      diagnosisWoundType: encryptField(insertReferral.diagnosisWoundType),
      notes: insertReferral.notes ? encryptField(insertReferral.notes) : null,
      patientNameHash: hashForSearch(insertReferral.patientName),
      patientDobHash: hashForSearch(insertReferral.patientDob),
      emailHash: hashForSearch(insertReferral.email),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [referral] = await db.insert(woundCareReferrals).values(encryptedValues).returning();
    return referral;
  }

  async getWoundCareReferrals(): Promise<WoundCareReferral[]> {
    const results = await db.select().from(woundCareReferrals).orderBy(desc(woundCareReferrals.createdAt));
    return results.map(r => ({
      ...r,
      providerName: decryptField(r.providerName),
      email: decryptField(r.email),
      phone: r.phone ? decryptField(r.phone) : r.phone,
      patientName: decryptField(r.patientName),
      patientDob: decryptField(r.patientDob),
      diagnosisWoundType: decryptField(r.diagnosisWoundType),
      notes: r.notes ? decryptField(r.notes) : r.notes,
    }));
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async createAdminSession(userId: number, token: string, expiresAt: Date, ipAddress?: string): Promise<AdminSession> {
    const [session] = await db.insert(adminSessions).values({ userId, token, expiresAt, ipAddress: ipAddress || null }).returning();
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const [session] = await db.select().from(adminSessions).where(eq(adminSessions.token, token));
    if (session && new Date(session.expiresAt) < new Date()) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return undefined;
    }
    return session || undefined;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser | undefined> {
    const [updated] = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id)).returning();
    return updated || undefined;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(adminUsers.name);
  }

  async deleteAdminSession(token: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  async deleteUserSessions(userId: number): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.userId, userId));
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, now));
  }

  async recordLoginAttempt(email: string, ipAddress: string, success: boolean, failureReason?: string): Promise<void> {
    await db.insert(loginAttempts).values({
      email,
      ipAddress,
      success: success ? 1 : 0,
      failureReason: failureReason || null,
    });
  }

  async getRecentFailedAttempts(email: string, minutes: number): Promise<number> {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const results = await db.select().from(loginAttempts)
      .where(and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.success, 0),
        gte(loginAttempts.createdAt, cutoff),
      ));
    return results.length;
  }

  async addPasswordHistory(userId: number, hash: string): Promise<void> {
    await db.insert(passwordHistory).values({ userId, passwordHash: hash });
  }

  async getPasswordHistory(userId: number, limit: number): Promise<PasswordHistory[]> {
    return await db.select().from(passwordHistory)
      .where(eq(passwordHistory.userId, userId))
      .orderBy(desc(passwordHistory.createdAt))
      .limit(limit);
  }

  async getPractices(): Promise<Practice[]> {
    return await db.select().from(practices)
      .where(ne(practices.name, "Lynk Demo"))
      .orderBy(practices.name);
  }

  async createPractice(insertPractice: InsertPractice): Promise<Practice> {
    const [practice] = await db.insert(practices).values(insertPractice).returning();
    return practice;
  }

  async getProgramSnapshots(practiceId?: number, programType?: string, month?: string, year?: number): Promise<ProgramSnapshot[]> {
    let query = db.select().from(programSnapshots);
    const conditions = [];
    if (practiceId) conditions.push(eq(programSnapshots.practiceId, practiceId));
    if (programType) conditions.push(eq(programSnapshots.programType, programType));
    if (month) conditions.push(eq(programSnapshots.month, month));
    if (year) conditions.push(eq(programSnapshots.year, year));
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(programSnapshots.createdAt));
    }
    return await query.orderBy(desc(programSnapshots.createdAt));
  }

  async createProgramSnapshot(insertSnapshot: InsertProgramSnapshot): Promise<ProgramSnapshot> {
    const [snapshot] = await db.insert(programSnapshots).values(insertSnapshot).returning();
    return snapshot;
  }

  async getAggregatedSnapshots(month: string, year: number): Promise<ProgramSnapshot[]> {
    const demoPractice = await db.select({ id: practices.id }).from(practices).where(eq(practices.name, "Lynk Demo"));
    const demoPracticeId = demoPractice[0]?.id;
    const conditions = [eq(programSnapshots.month, month), eq(programSnapshots.year, year)];
    if (demoPracticeId) conditions.push(ne(programSnapshots.practiceId, demoPracticeId));
    return await db.select().from(programSnapshots)
      .where(and(...conditions))
      .orderBy(programSnapshots.programType);
  }

  async getRevenueSnapshots(month: string, year: number): Promise<RevenueSnapshot[]> {
    const demoPractice = await db.select({ id: practices.id }).from(practices).where(eq(practices.name, "Lynk Demo"));
    const demoPracticeId = demoPractice[0]?.id;
    const conditions = [eq(revenueSnapshots.month, month), eq(revenueSnapshots.year, year)];
    if (demoPracticeId) conditions.push(ne(revenueSnapshots.practiceId, demoPracticeId));
    return await db.select().from(revenueSnapshots)
      .where(and(...conditions))
      .orderBy(revenueSnapshots.programType);
  }
  async getRevenueByCode(month: string, year: number): Promise<RevenueByCode[]> {
    const demoPractice = await db.select({ id: practices.id }).from(practices).where(eq(practices.name, "Lynk Demo"));
    const demoPracticeId = demoPractice[0]?.id;
    const conditions = [eq(revenueByCode.month, month), eq(revenueByCode.year, year)];
    if (demoPracticeId) conditions.push(ne(revenueByCode.practiceId, demoPracticeId));
    return await db.select().from(revenueByCode)
      .where(and(...conditions))
      .orderBy(revenueByCode.programType, revenueByCode.cptCode);
  }

  async getCptBillingCodes(effectiveYear?: number): Promise<CptBillingCode[]> {
    if (effectiveYear) {
      return await db.select().from(cptBillingCodes)
        .where(eq(cptBillingCodes.effectiveYear, effectiveYear))
        .orderBy(cptBillingCodes.program, cptBillingCodes.code);
    }
    return await db.select().from(cptBillingCodes).orderBy(cptBillingCodes.program, cptBillingCodes.code);
  }

  async getCptBillingCode(id: number): Promise<CptBillingCode | undefined> {
    const [code] = await db.select().from(cptBillingCodes).where(eq(cptBillingCodes.id, id));
    return code || undefined;
  }

  async createCptBillingCode(insertCode: InsertCptBillingCode): Promise<CptBillingCode> {
    const [code] = await db.insert(cptBillingCodes).values(insertCode).returning();
    return code;
  }

  async updateCptBillingCode(id: number, updates: Partial<InsertCptBillingCode>): Promise<CptBillingCode | undefined> {
    const [updated] = await db.update(cptBillingCodes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cptBillingCodes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCptBillingCode(id: number): Promise<void> {
    await db.delete(cptBillingCodes).where(eq(cptBillingCodes.id, id));
  }

  // ============================================================
  // Patients
  // ============================================================

  async listPatients(practiceId?: number, search?: string, page: number = 1, limit: number = 25): Promise<{ patients: Patient[]; total: number }> {
    const conditions = [];
    if (practiceId) conditions.push(eq(patients.practiceId, practiceId));
    if (search) {
      conditions.push(
        or(
          ilike(patients.firstName, `%${search}%`),
          ilike(patients.lastName, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;

    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(patients).where(whereClause);
    const total = Number(totalResult.count);

    const result = await db.select().from(patients)
      .where(whereClause)
      .orderBy(patients.lastName)
      .limit(limit)
      .offset(offset);

    return { patients: result, total };
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db.insert(patients).values(insertPatient).returning();
    return patient;
  }

  async updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updated] = await db.update(patients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePatient(id: number): Promise<void> {
    await db.delete(patients).where(eq(patients.id, id));
  }

  // ============================================================
  // Patient Conditions
  // ============================================================

  async getPatientConditions(patientId: number): Promise<PatientCondition[]> {
    return await db.select().from(patientConditions)
      .where(eq(patientConditions.patientId, patientId))
      .orderBy(desc(patientConditions.createdAt));
  }

  async createPatientCondition(condition: InsertPatientCondition): Promise<PatientCondition> {
    const [result] = await db.insert(patientConditions).values(condition).returning();
    return result;
  }

  async deletePatientCondition(id: number): Promise<void> {
    await db.delete(patientConditions).where(eq(patientConditions.id, id));
  }

  // ============================================================
  // Patient Medications
  // ============================================================

  async getPatientMedications(patientId: number): Promise<PatientMedication[]> {
    return await db.select().from(patientMedications)
      .where(eq(patientMedications.patientId, patientId))
      .orderBy(desc(patientMedications.createdAt));
  }

  async createPatientMedication(medication: InsertPatientMedication): Promise<PatientMedication> {
    const [result] = await db.insert(patientMedications).values(medication).returning();
    return result;
  }

  async updatePatientMedication(id: number, updates: Partial<InsertPatientMedication>): Promise<PatientMedication | undefined> {
    const [updated] = await db.update(patientMedications)
      .set(updates)
      .where(eq(patientMedications.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePatientMedication(id: number): Promise<void> {
    await db.delete(patientMedications).where(eq(patientMedications.id, id));
  }

  // ============================================================
  // Patient Allergies
  // ============================================================

  async getPatientAllergies(patientId: number): Promise<PatientAllergy[]> {
    return await db.select().from(patientAllergies)
      .where(eq(patientAllergies.patientId, patientId))
      .orderBy(desc(patientAllergies.createdAt));
  }

  async createPatientAllergy(allergy: InsertPatientAllergy): Promise<PatientAllergy> {
    const [result] = await db.insert(patientAllergies).values(allergy).returning();
    return result;
  }

  async deletePatientAllergy(id: number): Promise<void> {
    await db.delete(patientAllergies).where(eq(patientAllergies.id, id));
  }

  // ============================================================
  // Patient Vitals
  // ============================================================

  async getPatientVitals(patientId: number, limit?: number): Promise<PatientVital[]> {
    let query = db.select().from(patientVitals)
      .where(eq(patientVitals.patientId, patientId))
      .orderBy(desc(patientVitals.recordedAt));

    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async createPatientVital(vital: InsertPatientVital): Promise<PatientVital> {
    const [result] = await db.insert(patientVitals).values(vital).returning();
    return result;
  }

  // ============================================================
  // Patient Insurance
  // ============================================================

  async getPatientInsurance(patientId: number): Promise<PatientInsurance[]> {
    return await db.select().from(patientInsurance)
      .where(eq(patientInsurance.patientId, patientId))
      .orderBy(desc(patientInsurance.createdAt));
  }

  async createPatientInsurance(insurance: InsertPatientInsurance): Promise<PatientInsurance> {
    const [result] = await db.insert(patientInsurance).values(insurance).returning();
    return result;
  }

  async updatePatientInsurance(id: number, updates: Partial<InsertPatientInsurance>): Promise<PatientInsurance | undefined> {
    const [updated] = await db.update(patientInsurance)
      .set(updates)
      .where(eq(patientInsurance.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePatientInsurance(id: number): Promise<void> {
    await db.delete(patientInsurance).where(eq(patientInsurance.id, id));
  }

  // ============================================================
  // Program Enrollments
  // ============================================================

  async getEnrollments(patientId?: number): Promise<ProgramEnrollment[]> {
    if (patientId) {
      return await db.select().from(programEnrollments)
        .where(eq(programEnrollments.patientId, patientId))
        .orderBy(desc(programEnrollments.enrolledAt));
    }
    return await db.select().from(programEnrollments)
      .orderBy(desc(programEnrollments.enrolledAt));
  }

  async getEnrollmentsByProgram(programType: string, practiceId?: number): Promise<ProgramEnrollment[]> {
    const conditions = [eq(programEnrollments.programType, programType)];
    if (practiceId) conditions.push(eq(programEnrollments.practiceId, practiceId));

    return await db.select().from(programEnrollments)
      .where(and(...conditions))
      .orderBy(desc(programEnrollments.enrolledAt));
  }

  async createEnrollment(enrollment: InsertProgramEnrollment): Promise<ProgramEnrollment> {
    const [result] = await db.insert(programEnrollments).values(enrollment).returning();
    return result;
  }

  async updateEnrollment(id: number, updates: Partial<InsertProgramEnrollment>): Promise<ProgramEnrollment | undefined> {
    const [updated] = await db.update(programEnrollments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(programEnrollments.id, id))
      .returning();
    return updated || undefined;
  }

  // ============================================================
  // Care Plans
  // ============================================================

  async getCarePlans(patientId: number): Promise<CarePlan[]> {
    return await db.select().from(carePlans)
      .where(eq(carePlans.patientId, patientId))
      .orderBy(desc(carePlans.createdAt));
  }

  async getCarePlan(id: number): Promise<CarePlan | undefined> {
    const [plan] = await db.select().from(carePlans).where(eq(carePlans.id, id));
    return plan || undefined;
  }

  async createCarePlan(carePlan: InsertCarePlan): Promise<CarePlan> {
    const [result] = await db.insert(carePlans).values(carePlan).returning();
    return result;
  }

  async updateCarePlan(id: number, updates: Partial<InsertCarePlan>): Promise<CarePlan | undefined> {
    const [updated] = await db.update(carePlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(carePlans.id, id))
      .returning();
    return updated || undefined;
  }

  // ============================================================
  // Care Plan Items
  // ============================================================

  async getCarePlanItems(carePlanId: number): Promise<CarePlanItem[]> {
    return await db.select().from(carePlanItems)
      .where(eq(carePlanItems.carePlanId, carePlanId))
      .orderBy(desc(carePlanItems.createdAt));
  }

  async createCarePlanItem(item: InsertCarePlanItem): Promise<CarePlanItem> {
    const [result] = await db.insert(carePlanItems).values(item).returning();
    return result;
  }

  async updateCarePlanItem(id: number, updates: Partial<InsertCarePlanItem>): Promise<CarePlanItem | undefined> {
    const [updated] = await db.update(carePlanItems)
      .set(updates)
      .where(eq(carePlanItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCarePlanItem(id: number): Promise<void> {
    await db.delete(carePlanItems).where(eq(carePlanItems.id, id));
  }

  // ============================================================
  // Time Logs
  // ============================================================

  async getTimeLogs(patientId?: number, enrollmentId?: number, userId?: number): Promise<TimeLog[]> {
    const conditions = [];
    if (patientId) conditions.push(eq(timeLogs.patientId, patientId));
    if (enrollmentId) conditions.push(eq(timeLogs.enrollmentId, enrollmentId));
    if (userId) conditions.push(eq(timeLogs.userId, userId));

    if (conditions.length > 0) {
      return await db.select().from(timeLogs)
        .where(and(...conditions))
        .orderBy(desc(timeLogs.createdAt));
    }
    return await db.select().from(timeLogs)
      .orderBy(desc(timeLogs.createdAt));
  }

  async createTimeLog(timeLog: InsertTimeLog): Promise<TimeLog> {
    const [result] = await db.insert(timeLogs).values(timeLog).returning();
    return result;
  }

  async getTimeLogSummary(patientId: number, programType: string, month: string, year: number): Promise<{ totalSeconds: number }> {
    const [result] = await db.select({
      totalSeconds: sql<number>`coalesce(sum(${timeLogs.durationSeconds}), 0)`
    }).from(timeLogs)
      .where(and(
        eq(timeLogs.patientId, patientId),
        eq(timeLogs.programType, programType),
        sql`extract(month from ${timeLogs.createdAt}) = ${parseInt(month)}`,
        sql`extract(year from ${timeLogs.createdAt}) = ${year}`
      ));
    return { totalSeconds: Number(result.totalSeconds) };
  }

  // ============================================================
  // Clinical Tasks
  // ============================================================

  async getTasks(assignedTo?: number, patientId?: number): Promise<ClinicalTask[]> {
    const conditions = [];
    if (assignedTo) conditions.push(eq(clinicalTasks.assignedTo, assignedTo));
    if (patientId) conditions.push(eq(clinicalTasks.patientId, patientId));

    if (conditions.length > 0) {
      return await db.select().from(clinicalTasks)
        .where(and(...conditions))
        .orderBy(desc(clinicalTasks.createdAt));
    }
    return await db.select().from(clinicalTasks)
      .orderBy(desc(clinicalTasks.createdAt));
  }

  async createTask(task: InsertClinicalTask): Promise<ClinicalTask> {
    const [result] = await db.insert(clinicalTasks).values(task).returning();
    return result;
  }

  async updateTask(id: number, updates: Partial<InsertClinicalTask>): Promise<ClinicalTask | undefined> {
    const [updated] = await db.update(clinicalTasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clinicalTasks.id, id))
      .returning();
    return updated || undefined;
  }

  // ============================================================
  // Patient Assessments
  // ============================================================

  async getAssessments(patientId: number): Promise<PatientAssessment[]> {
    return await db.select().from(patientAssessments)
      .where(eq(patientAssessments.patientId, patientId))
      .orderBy(desc(patientAssessments.createdAt));
  }

  async createAssessment(assessment: InsertPatientAssessment): Promise<PatientAssessment> {
    const [result] = await db.insert(patientAssessments).values(assessment).returning();
    return result;
  }

  // ============================================================
  // Calendar Events
  // ============================================================

  async getEvents(userId?: number, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const conditions = [];
    if (userId) conditions.push(eq(calendarEvents.userId, userId));
    if (startDate) conditions.push(gte(calendarEvents.startTime, startDate));
    if (endDate) conditions.push(lte(calendarEvents.startTime, endDate));

    if (conditions.length > 0) {
      return await db.select().from(calendarEvents)
        .where(and(...conditions))
        .orderBy(calendarEvents.startTime);
    }
    return await db.select().from(calendarEvents)
      .orderBy(calendarEvents.startTime);
  }

  async createEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [result] = await db.insert(calendarEvents).values(event).returning();
    return result;
  }

  async updateEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const [updated] = await db.update(calendarEvents)
      .set(updates)
      .where(eq(calendarEvents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
  }

  // ============================================================
  // Claims
  // ============================================================

  async getClaims(practiceId?: number, programType?: string, status?: string): Promise<Claim[]> {
    const conditions = [];
    if (practiceId) conditions.push(eq(claims.practiceId, practiceId));
    if (programType) conditions.push(eq(claims.programType, programType));
    if (status) conditions.push(eq(claims.status, status));

    if (conditions.length > 0) {
      return await db.select().from(claims)
        .where(and(...conditions))
        .orderBy(desc(claims.createdAt));
    }
    return await db.select().from(claims)
      .orderBy(desc(claims.createdAt));
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const [result] = await db.insert(claims).values(claim).returning();
    return result;
  }

  async updateClaim(id: number, updates: Partial<InsertClaim>): Promise<Claim | undefined> {
    const [updated] = await db.update(claims)
      .set(updates)
      .where(eq(claims.id, id))
      .returning();
    return updated || undefined;
  }

  // ============================================================
  // Care Plan Templates
  // ============================================================

  async getCarePlanTemplates(programType?: string): Promise<CarePlanTemplate[]> {
    if (programType) {
      return await db.select().from(carePlanTemplates)
        .where(and(eq(carePlanTemplates.programType, programType), eq(carePlanTemplates.isActive, 1)))
        .orderBy(carePlanTemplates.name);
    }
    return await db.select().from(carePlanTemplates)
      .where(eq(carePlanTemplates.isActive, 1))
      .orderBy(carePlanTemplates.name);
  }

  async getCarePlanTemplate(id: number): Promise<CarePlanTemplate | undefined> {
    const [template] = await db.select().from(carePlanTemplates).where(eq(carePlanTemplates.id, id));
    return template || undefined;
  }

  async createCarePlanTemplate(template: InsertCarePlanTemplate): Promise<CarePlanTemplate> {
    const [result] = await db.insert(carePlanTemplates).values(template).returning();
    return result;
  }

  async updateCarePlanTemplate(id: number, updates: Partial<InsertCarePlanTemplate>): Promise<CarePlanTemplate | undefined> {
    const [updated] = await db.update(carePlanTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(carePlanTemplates.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCarePlanTemplate(id: number): Promise<void> {
    await db.update(carePlanTemplates).set({ isActive: 0 }).where(eq(carePlanTemplates.id, id));
  }

  async getCarePlanTemplateItems(templateId: number): Promise<CarePlanTemplateItem[]> {
    return await db.select().from(carePlanTemplateItems)
      .where(eq(carePlanTemplateItems.templateId, templateId))
      .orderBy(carePlanTemplateItems.sortOrder);
  }

  async createCarePlanTemplateItem(item: InsertCarePlanTemplateItem): Promise<CarePlanTemplateItem> {
    const [result] = await db.insert(carePlanTemplateItems).values(item).returning();
    return result;
  }

  async deleteCarePlanTemplateItem(id: number): Promise<void> {
    await db.delete(carePlanTemplateItems).where(eq(carePlanTemplateItems.id, id));
  }

  // ============================================================
  // Dashboard Aggregates
  // ============================================================

  async getDashboardStats(userId?: number): Promise<{
    totalPatients: number;
    activeEnrollments: number;
    pendingTasks: number;
    todayEvents: number;
    minutesThisMonth: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [patientCount] = await db.select({ count: sql<number>`count(*)` }).from(patients).where(eq(patients.status, "active"));
    const [enrollmentCount] = await db.select({ count: sql<number>`count(*)` }).from(programEnrollments).where(eq(programEnrollments.status, "enrolled"));

    const taskConditions = [
      or(eq(clinicalTasks.status, "pending"), eq(clinicalTasks.status, "in_progress"))
    ];
    if (userId) taskConditions.push(eq(clinicalTasks.assignedTo, userId));
    const [taskCount] = await db.select({ count: sql<number>`count(*)` }).from(clinicalTasks).where(and(...taskConditions));

    const eventConditions = [
      gte(calendarEvents.startTime, startOfDay),
      lte(calendarEvents.startTime, endOfDay),
    ];
    if (userId) eventConditions.push(eq(calendarEvents.userId, userId));
    const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(calendarEvents).where(and(...eventConditions));

    const minuteConditions = [gte(timeLogs.createdAt, startOfMonth)];
    if (userId) minuteConditions.push(eq(timeLogs.userId, userId));
    const [minuteSum] = await db.select({ total: sql<number>`coalesce(sum(${timeLogs.durationSeconds}), 0)` }).from(timeLogs).where(and(...minuteConditions));

    return {
      totalPatients: Number(patientCount.count),
      activeEnrollments: Number(enrollmentCount.count),
      pendingTasks: Number(taskCount.count),
      todayEvents: Number(eventCount.count),
      minutesThisMonth: Math.round(Number(minuteSum.total) / 60),
    };
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(clinicalTasks).where(eq(clinicalTasks.id, id));
  }

  async createPoorEngagementForm(form: InsertPoorEngagementForm): Promise<PoorEngagementForm> {
    const [created] = await db.insert(poorEngagementForms).values(form).returning();
    return created;
  }

  async listPoorEngagementForms(status?: string): Promise<PoorEngagementForm[]> {
    const conditions = [];
    if (status) conditions.push(eq(poorEngagementForms.status, status));
    return db.select().from(poorEngagementForms)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(poorEngagementForms.createdAt));
  }

  async getPoorEngagementForm(id: number): Promise<PoorEngagementForm | undefined> {
    const [form] = await db.select().from(poorEngagementForms).where(eq(poorEngagementForms.id, id));
    return form;
  }

  async updatePoorEngagementFormStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<PoorEngagementForm | undefined> {
    const [updated] = await db.update(poorEngagementForms)
      .set({ status, reviewedBy, reviewedAt: new Date(), reviewNotes: reviewNotes || null })
      .where(eq(poorEngagementForms.id, id))
      .returning();
    return updated;
  }

  async createBillingEvaluationForm(form: InsertBillingEvaluationForm): Promise<BillingEvaluationForm> {
    const [created] = await db.insert(billingEvaluationForms).values(form).returning();
    return created;
  }

  async listBillingEvaluationForms(status?: string): Promise<BillingEvaluationForm[]> {
    const conditions = [];
    if (status) conditions.push(eq(billingEvaluationForms.status, status));
    return db.select().from(billingEvaluationForms)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(billingEvaluationForms.createdAt));
  }

  async getBillingEvaluationForm(id: number): Promise<BillingEvaluationForm | undefined> {
    const [form] = await db.select().from(billingEvaluationForms).where(eq(billingEvaluationForms.id, id));
    return form;
  }

  async updateBillingEvaluationFormStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<BillingEvaluationForm | undefined> {
    const [updated] = await db.update(billingEvaluationForms)
      .set({ status, reviewedBy, reviewedAt: new Date(), reviewNotes: reviewNotes || null })
      .where(eq(billingEvaluationForms.id, id))
      .returning();
    return updated;
  }

  async getInvoiceRates(year: number, practiceId?: number | null): Promise<InvoiceRate[]> {
    const conditions = [eq(invoiceRates.effectiveYear, year)];
    if (practiceId !== undefined && practiceId !== null) {
      conditions.push(eq(invoiceRates.practiceId, practiceId));
    } else {
      conditions.push(isNull(invoiceRates.practiceId));
    }
    return db.select().from(invoiceRates)
      .where(and(...conditions))
      .orderBy(invoiceRates.program, invoiceRates.cptCode);
  }

  async upsertInvoiceRate(rate: InsertInvoiceRate): Promise<InvoiceRate> {
    const yearVal = rate.effectiveYear ?? 2026;
    const pidCondition = rate.practiceId
      ? eq(invoiceRates.practiceId, rate.practiceId)
      : isNull(invoiceRates.practiceId);
    const existing = await db.select().from(invoiceRates)
      .where(and(
        eq(invoiceRates.cptCode, rate.cptCode),
        eq(invoiceRates.effectiveYear, yearVal),
        pidCondition
      ));
    if (existing.length > 0) {
      const [updated] = await db.update(invoiceRates)
        .set({ invoiceRateCents: rate.invoiceRateCents, updatedAt: new Date() })
        .where(eq(invoiceRates.id, existing[0].id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(invoiceRates).values(rate).returning();
    return created;
  }

  async initInvoiceRatesForPractice(practiceId: number, year: number): Promise<InvoiceRate[]> {
    const existingRates = await this.getInvoiceRates(year, practiceId);
    if (existingRates.length > 0) return existingRates;

    const billingCodes = await db.select().from(cptBillingCodes)
      .where(eq(cptBillingCodes.effectiveYear, year));

    for (const bc of billingCodes) {
      await db.insert(invoiceRates).values({
        practiceId,
        cptCode: bc.code,
        program: bc.program,
        description: bc.description,
        claimRateCents: bc.rateCents,
        invoiceRateCents: bc.rateCents,
        effectiveYear: year,
      });
    }

    return this.getInvoiceRates(year, practiceId);
  }

  async generateInvoices(month: string, year: number): Promise<Invoice[]> {
    const allPractices = await db.select().from(practices)
      .where(and(ne(practices.name, "Lynk Demo"), eq(practices.status, "active")))
      .orderBy(practices.name);

    const codeData = await db.select().from(revenueByCode)
      .where(and(eq(revenueByCode.month, month), eq(revenueByCode.year, year)));

    const fallbackBillingCodes = await db.select().from(cptBillingCodes)
      .where(eq(cptBillingCodes.effectiveYear, year));
    const fallbackRateMap: Record<string, number> = {};
    const fallbackDescMap: Record<string, string> = {};
    for (const bc of fallbackBillingCodes) {
      fallbackRateMap[bc.code] = bc.rateCents;
      fallbackDescMap[bc.code] = bc.description;
    }

    const generatedInvoices: Invoice[] = [];
    const MONTH_NAMES: Record<string, string> = {
      JAN: "January", FEB: "February", MAR: "March", APR: "April",
      MAY: "May", JUN: "June", JUL: "July", AUG: "August",
      SEP: "September", OCT: "October", NOV: "November", DEC: "December"
    };

    const deptPractice = allPractices.find(p => p.name.toLowerCase() === "your clinic");
    const deptPracticeId = deptPractice?.id;
    let deptList: string[] = [];
    if (deptPracticeId) {
      const deptRows = await db.selectDistinct({ department: revenueByCode.department })
        .from(revenueByCode)
        .where(and(
          eq(revenueByCode.practiceId, deptPracticeId),
          eq(revenueByCode.month, month),
          eq(revenueByCode.year, year),
          sql`${revenueByCode.department} IS NOT NULL`
        ));
      deptList = deptRows.map(d => d.department!).filter(Boolean);
    }

    const createInvoice = async (practiceId: number, displayName: string, department: string | null, rateMap: Record<string, number>, descMap: Record<string, string>) => {
      const practiceCodeData = codeData.filter(c => {
        if (c.practiceId !== practiceId) return false;
        if (department) return c.department === department;
        return !c.department;
      });

      const lineItemsData: { programType: string; cptCode: string; description: string | null; claimCount: number; rateCents: number; totalCents: number }[] = [];
      let totalAmountCents = 0;
      let totalClaims = 0;

      for (const row of practiceCodeData) {
        const claimCount = row.claimCount || 0;
        const rate = rateMap[row.cptCode] || 0;
        const totalCents = claimCount * rate;
        lineItemsData.push({
          programType: row.programType,
          cptCode: row.cptCode,
          description: descMap[row.cptCode] || null,
          claimCount,
          rateCents: rate,
          totalCents,
        });
        totalAmountCents += totalCents;
        totalClaims += claimCount;
      }

      const deptSlug = department ? `-${department.replace(/\s+/g, "").substring(0, 10)}` : "";
      const invoiceNumber = `INV-${practiceId}${deptSlug}-${year}-${month}`;
      const [invoice] = await db.insert(invoices).values({
        invoiceNumber,
        practiceId,
        practiceName: displayName,
        department,
        month,
        year,
        totalAmountCents,
        totalClaims,
        status: "pending_review",
        notes: `Auto-generated invoice for ${MONTH_NAMES[month] || month} ${year}`,
      }).returning();

      for (const li of lineItemsData) {
        await db.insert(invoiceLineItems).values({
          invoiceId: invoice.id,
          programType: li.programType,
          cptCode: li.cptCode,
          description: li.description,
          claimCount: li.claimCount,
          rateCents: li.rateCents,
          totalCents: li.totalCents,
        });
      }

      return invoice;
    };

    for (const practice of allPractices) {
      const practiceRates = await this.getInvoiceRates(year, practice.id);
      const invoiceRateMap: Record<string, number> = { ...fallbackRateMap };
      const rateDescMap: Record<string, string> = { ...fallbackDescMap };
      for (const r of practiceRates) {
        invoiceRateMap[r.cptCode] = r.invoiceRateCents;
        if (r.description) rateDescMap[r.cptCode] = r.description;
      }

      if (practice.id === deptPracticeId && deptList.length > 0) {
        for (const dept of deptList) {
          const existing = await db.select().from(invoices)
            .where(and(
              eq(invoices.practiceId, practice.id),
              eq(invoices.month, month),
              eq(invoices.year, year),
              eq(invoices.department, dept)
            ));
          if (existing.length > 0) continue;

          const invoice = await createInvoice(practice.id, dept, dept, invoiceRateMap, rateDescMap);
          generatedInvoices.push(invoice);
        }
      } else {
        const existing = await db.select().from(invoices)
          .where(and(
            eq(invoices.practiceId, practice.id),
            eq(invoices.month, month),
            eq(invoices.year, year)
          ));
        if (existing.length > 0) continue;

        const invoice = await createInvoice(practice.id, practice.name, null, invoiceRateMap, rateDescMap);
        generatedInvoices.push(invoice);
      }
    }

    return generatedInvoices;
  }

  async listInvoices(status?: string, practiceId?: number): Promise<Invoice[]> {
    const conditions: any[] = [];
    if (status) conditions.push(eq(invoices.status, status));
    if (practiceId) conditions.push(eq(invoices.practiceId, practiceId));
    return db.select().from(invoices)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(invoices.generatedAt));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return db.select().from(invoiceLineItems)
      .where(eq(invoiceLineItems.invoiceId, invoiceId))
      .orderBy(invoiceLineItems.programType, invoiceLineItems.cptCode);
  }

  async updateInvoiceStatus(id: number, status: string, userId: number, notes?: string): Promise<Invoice | undefined> {
    const updates: Record<string, any> = { status };
    if (status === "approved") {
      updates.approvedBy = userId;
      updates.approvedAt = new Date();
    }
    updates.reviewedBy = userId;
    updates.reviewedAt = new Date();
    if (notes !== undefined) updates.notes = notes;
    const [updated] = await db.update(invoices)
      .set(updates)
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id));
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getStaffingReport(month: string, year: number, practiceId?: number, department?: string): Promise<any[]> {
    const conditions = [
      eq(tcStaffTimeLogs.month, month),
      eq(tcStaffTimeLogs.year, year),
    ];
    if (practiceId) {
      conditions.push(eq(tcStaffTimeLogs.practiceId, practiceId));
    }
    if (department) {
      conditions.push(eq(tcStaffTimeLogs.department, department));
    }

    const rows = await db.select({
      staffTcId: tcStaffTimeLogs.staffTcId,
      staffName: tcStaffTimeLogs.staffName,
      staffRole: tcStaffTimeLogs.staffRole,
      practiceId: tcStaffTimeLogs.practiceId,
      department: tcStaffTimeLogs.department,
      programType: tcStaffTimeLogs.programType,
      totalMinutes: sql<number>`COALESCE(SUM(${tcStaffTimeLogs.minutes}), 0)`.as("total_minutes"),
      logCount: sql<number>`COUNT(*)`.as("log_count"),
    })
      .from(tcStaffTimeLogs)
      .where(and(...conditions))
      .groupBy(
        tcStaffTimeLogs.staffTcId,
        tcStaffTimeLogs.staffName,
        tcStaffTimeLogs.staffRole,
        tcStaffTimeLogs.practiceId,
        tcStaffTimeLogs.department,
        tcStaffTimeLogs.programType
      )
      .orderBy(desc(sql`SUM(${tcStaffTimeLogs.minutes})`));

    return rows;
  }

  async getStaffRevenueReport(month: string, year: number, practiceId?: number, department?: string): Promise<any[]> {
    const staffConditions = [
      eq(tcStaffTimeLogs.month, month),
      eq(tcStaffTimeLogs.year, year),
    ];
    if (practiceId) staffConditions.push(eq(tcStaffTimeLogs.practiceId, practiceId));
    if (department) staffConditions.push(eq(tcStaffTimeLogs.department, department));

    const staffRows = await db.select({
      staffTcId: tcStaffTimeLogs.staffTcId,
      staffName: tcStaffTimeLogs.staffName,
      staffRole: tcStaffTimeLogs.staffRole,
      practiceId: tcStaffTimeLogs.practiceId,
      department: tcStaffTimeLogs.department,
      programType: tcStaffTimeLogs.programType,
      totalMinutes: sql<number>`COALESCE(SUM(${tcStaffTimeLogs.minutes}), 0)`.as("total_minutes"),
      logCount: sql<number>`COUNT(*)`.as("log_count"),
    })
      .from(tcStaffTimeLogs)
      .where(and(...staffConditions))
      .groupBy(
        tcStaffTimeLogs.staffTcId,
        tcStaffTimeLogs.staffName,
        tcStaffTimeLogs.staffRole,
        tcStaffTimeLogs.practiceId,
        tcStaffTimeLogs.department,
        tcStaffTimeLogs.programType
      );

    const revConditions = [
      eq(revenueSnapshots.month, month),
      eq(revenueSnapshots.year, year),
    ];
    if (practiceId) revConditions.push(eq(revenueSnapshots.practiceId, practiceId));
    if (department) revConditions.push(eq(revenueSnapshots.department, department));

    const revRows = await db.select({
      practiceId: revenueSnapshots.practiceId,
      department: revenueSnapshots.department,
      programType: revenueSnapshots.programType,
      totalRevenue: revenueSnapshots.totalRevenue,
      claimCount: revenueSnapshots.claimCount,
    })
      .from(revenueSnapshots)
      .where(and(...revConditions));

    const practicesWithDeptRevenue = new Set<string>();
    for (const r of revRows) {
      if (r.department) practicesWithDeptRevenue.add(`${r.practiceId}|${r.programType}`);
    }

    const revMap = new Map<string, { revenue: number; claims: number }>();
    for (const r of revRows) {
      const hasDeptData = practicesWithDeptRevenue.has(`${r.practiceId}|${r.programType}`);
      if (!r.department && hasDeptData) continue;
      const key = `${r.practiceId}|${r.department || ""}|${r.programType}`;
      const existing = revMap.get(key) || { revenue: 0, claims: 0 };
      existing.revenue += Number(r.totalRevenue) || 0;
      existing.claims += Number(r.claimCount) || 0;
      revMap.set(key, existing);
    }

    const totalMinutesMap = new Map<string, number>();
    for (const s of staffRows) {
      const key = `${s.practiceId}|${s.department || ""}|${s.programType}`;
      totalMinutesMap.set(key, (totalMinutesMap.get(key) || 0) + (Number(s.totalMinutes) || 0));
    }

    const allocatedRevKeys = new Set<string>();
    const result = staffRows.map(s => {
      const key = `${s.practiceId}|${s.department || ""}|${s.programType}`;
      allocatedRevKeys.add(key);
      const rev = revMap.get(key);
      const totalMins = totalMinutesMap.get(key) || 1;
      const staffMins = Number(s.totalMinutes) || 0;
      const proportion = staffMins / totalMins;
      const estimatedRevenue = rev ? Math.round(rev.revenue * proportion) : 0;
      const estimatedClaims = rev ? Math.round(rev.claims * proportion) : 0;
      return {
        ...s,
        estimatedRevenueCents: estimatedRevenue,
        estimatedClaims,
      };
    });

    for (const key of Array.from(revMap.keys())) {
      if (allocatedRevKeys.has(key)) continue;
      const rev = revMap.get(key)!;
      const [pId, dept, prog] = key.split("|");
      result.push({
        staffTcId: "__unallocated__",
        staffName: "Unallocated (No Time Logs)",
        staffRole: "—",
        practiceId: parseInt(pId),
        department: dept || null,
        programType: prog,
        totalMinutes: 0,
        logCount: 0,
        estimatedRevenueCents: rev.revenue,
        estimatedClaims: rev.claims,
      } as any);
    }

    return result;
  }

  async clearStaffTimeLogs(month: string, year: number): Promise<void> {
    await db.delete(tcStaffTimeLogs)
      .where(and(eq(tcStaffTimeLogs.month, month), eq(tcStaffTimeLogs.year, year)));
  }
}

export const storage = new DatabaseStorage();
