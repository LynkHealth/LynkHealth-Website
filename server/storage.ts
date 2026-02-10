import { users, contactInquiries, nightCoverageInquiries, woundCareReferrals, adminUsers, adminSessions, practices, programSnapshots, revenueSnapshots, revenueByCode, cptBillingCodes, patients, patientConditions, patientMedications, patientAllergies, patientVitals, patientInsurance, programEnrollments, carePlans, carePlanItems, timeLogs, clinicalTasks, patientAssessments, calendarEvents, claims, type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, type NightCoverageInquiry, type InsertNightCoverageInquiry, type WoundCareReferral, type InsertWoundCareReferral, type AdminUser, type InsertAdminUser, type AdminSession, type Practice, type InsertPractice, type ProgramSnapshot, type InsertProgramSnapshot, type RevenueSnapshot, type InsertRevenueSnapshot, type RevenueByCode, type CptBillingCode, type InsertCptBillingCode, type Patient, type InsertPatient, type PatientCondition, type InsertPatientCondition, type PatientMedication, type InsertPatientMedication, type PatientAllergy, type InsertPatientAllergy, type PatientVital, type InsertPatientVital, type PatientInsurance, type InsertPatientInsurance, type ProgramEnrollment, type InsertProgramEnrollment, type CarePlan, type InsertCarePlan, type CarePlanItem, type InsertCarePlanItem, type TimeLog, type InsertTimeLog, type ClinicalTask, type InsertClinicalTask, type PatientAssessment, type InsertPatientAssessment, type CalendarEvent, type InsertCalendarEvent, type Claim, type InsertClaim } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or, ilike, sql, gte, lte } from "drizzle-orm";

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
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  createAdminSession(userId: number, token: string, expiresAt: Date): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<void>;
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
    const [inquiry] = await db.insert(contactInquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async createNightCoverageInquiry(insertInquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry> {
    const [inquiry] = await db.insert(nightCoverageInquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getNightCoverageInquiries(): Promise<NightCoverageInquiry[]> {
    return await db.select().from(nightCoverageInquiries).orderBy(desc(nightCoverageInquiries.createdAt));
  }

  async createWoundCareReferral(insertReferral: InsertWoundCareReferral): Promise<WoundCareReferral> {
    const [referral] = await db.insert(woundCareReferrals).values(insertReferral).returning();
    return referral;
  }

  async getWoundCareReferrals(): Promise<WoundCareReferral[]> {
    return await db.select().from(woundCareReferrals).orderBy(desc(woundCareReferrals.createdAt));
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async createAdminSession(userId: number, token: string, expiresAt: Date): Promise<AdminSession> {
    const [session] = await db.insert(adminSessions).values({ userId, token, expiresAt }).returning();
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

  async deleteAdminSession(token: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  async getPractices(): Promise<Practice[]> {
    return await db.select().from(practices).orderBy(practices.name);
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
    return await db.select().from(programSnapshots)
      .where(and(eq(programSnapshots.month, month), eq(programSnapshots.year, year)))
      .orderBy(programSnapshots.programType);
  }

  async getRevenueSnapshots(month: string, year: number): Promise<RevenueSnapshot[]> {
    return await db.select().from(revenueSnapshots)
      .where(and(eq(revenueSnapshots.month, month), eq(revenueSnapshots.year, year)))
      .orderBy(revenueSnapshots.programType);
  }
  async getRevenueByCode(month: string, year: number): Promise<RevenueByCode[]> {
    return await db.select().from(revenueByCode)
      .where(and(eq(revenueByCode.month, month), eq(revenueByCode.year, year)))
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
  // Admin Users
  // ============================================================

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(adminUsers.name);
  }

  async updateAdminUser(id: number, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [updated] = await db.update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
