import {
  users, contactInquiries, nightCoverageInquiries, woundCareReferrals,
  adminUsers, adminSessions, practices, programSnapshots,
  auditLogs, loginAttempts, passwordHistory,
  callSessions, transcripts, soapNotes, timeEntries,
  type User, type InsertUser,
  type ContactInquiry, type InsertContactInquiry,
  type NightCoverageInquiry, type InsertNightCoverageInquiry,
  type WoundCareReferral, type InsertWoundCareReferral,
  type AdminUser, type InsertAdminUser, type AdminSession,
  type Practice, type InsertPractice,
  type ProgramSnapshot, type InsertProgramSnapshot,
  type AuditLog, type LoginAttempt, type PasswordHistoryEntry,
  type CallSession, type InsertCallSession,
  type Transcript, type InsertTranscript,
  type SoapNote, type InsertSoapNote,
  type TimeEntry, type InsertTimeEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lt } from "drizzle-orm";
import {
  encryptField, decryptField, hashForSearch,
  getCurrentKeyId, isEncryptionConfigured,
} from "./encryption";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact inquiries (PII)
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;

  // Night coverage inquiries (PII)
  createNightCoverageInquiry(inquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry>;
  getNightCoverageInquiries(): Promise<NightCoverageInquiry[]>;

  // Wound care referrals (PHI)
  createWoundCareReferral(referral: InsertWoundCareReferral): Promise<WoundCareReferral>;
  getWoundCareReferrals(): Promise<WoundCareReferral[]>;

  // Admin users
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<void>;
  getAdminUsers(): Promise<AdminUser[]>;

  // Sessions (HIPAA 164.312(a)(2)(iii), 164.312(d))
  createAdminSession(userId: number, token: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  updateSessionActivity(token: string, timestamp: Date): Promise<void>;
  deleteAdminSession(token: string): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  cleanExpiredSessions(): Promise<number>;

  // Login attempts (HIPAA 164.312(a)(1))
  recordLoginAttempt(email: string, ipAddress: string, success: boolean): Promise<void>;
  getRecentFailedAttempts(email: string, windowMs: number): Promise<number>;

  // Password history (HIPAA 164.312(d))
  addPasswordHistory(userId: number, passwordHash: string): Promise<void>;
  getPasswordHistory(userId: number, limit: number): Promise<PasswordHistoryEntry[]>;

  // Practices & snapshots
  getPractices(): Promise<Practice[]>;
  createPractice(practice: InsertPractice): Promise<Practice>;
  getProgramSnapshots(practiceId?: number, programType?: string, month?: string, year?: number): Promise<ProgramSnapshot[]>;
  createProgramSnapshot(snapshot: InsertProgramSnapshot): Promise<ProgramSnapshot>;
  getAggregatedSnapshots(month: string, year: number): Promise<ProgramSnapshot[]>;

  // Call Sessions (Ambient AI)
  createCallSession(session: InsertCallSession): Promise<CallSession>;
  getCallSession(id: number): Promise<CallSession | undefined>;
  getCallSessions(filters?: { clinicianId?: number; practiceId?: number; programType?: string; status?: string }): Promise<CallSession[]>;
  updateCallSession(id: number, updates: Partial<CallSession>): Promise<void>;

  // Transcripts
  createTranscript(transcript: InsertTranscript): Promise<Transcript>;
  getTranscriptByCallSession(callSessionId: number): Promise<Transcript | undefined>;
  updateTranscript(id: number, updates: Partial<Transcript>): Promise<void>;

  // SOAP Notes
  createSoapNote(note: InsertSoapNote): Promise<SoapNote>;
  getSoapNoteByCallSession(callSessionId: number): Promise<SoapNote | undefined>;
  updateSoapNote(id: number, updates: Partial<SoapNote>): Promise<void>;

  // Time Entries
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  getTimeEntries(filters?: { clinicianId?: number; practiceId?: number; programType?: string; date?: string; month?: string; year?: number }): Promise<TimeEntry[]>;
  deleteTimeEntry(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ================================================================
  // Users
  // ================================================================

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

  // ================================================================
  // Contact Inquiries (PII -- encrypted at rest)
  // ================================================================

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const encrypted = {
      ...insertInquiry,
      firstName: encryptField(insertInquiry.firstName),
      lastName: encryptField(insertInquiry.lastName),
      email: encryptField(insertInquiry.email),
      phone: insertInquiry.phone ? encryptField(insertInquiry.phone) : null,
      message: insertInquiry.message ? encryptField(insertInquiry.message) : null,
      emailHash: hashForSearch(insertInquiry.email),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [inquiry] = await db.insert(contactInquiries).values(encrypted).returning();
    return this.decryptContactInquiry(inquiry);
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const rows = await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
    return rows.map((r) => this.decryptContactInquiry(r));
  }

  private decryptContactInquiry(row: ContactInquiry): ContactInquiry {
    return {
      ...row,
      firstName: decryptField(row.firstName),
      lastName: decryptField(row.lastName),
      email: decryptField(row.email),
      phone: row.phone ? decryptField(row.phone) : row.phone,
      message: row.message ? decryptField(row.message) : row.message,
    };
  }

  // ================================================================
  // Night Coverage Inquiries (PII -- encrypted at rest)
  // ================================================================

  async createNightCoverageInquiry(insertInquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry> {
    const encrypted = {
      ...insertInquiry,
      contactName: encryptField(insertInquiry.contactName),
      email: encryptField(insertInquiry.email),
      phone: insertInquiry.phone ? encryptField(insertInquiry.phone) : null,
      message: insertInquiry.message ? encryptField(insertInquiry.message) : null,
      emailHash: hashForSearch(insertInquiry.email),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [inquiry] = await db.insert(nightCoverageInquiries).values(encrypted).returning();
    return this.decryptNightCoverageInquiry(inquiry);
  }

  async getNightCoverageInquiries(): Promise<NightCoverageInquiry[]> {
    const rows = await db.select().from(nightCoverageInquiries).orderBy(desc(nightCoverageInquiries.createdAt));
    return rows.map((r) => this.decryptNightCoverageInquiry(r));
  }

  private decryptNightCoverageInquiry(row: NightCoverageInquiry): NightCoverageInquiry {
    return {
      ...row,
      contactName: decryptField(row.contactName),
      email: decryptField(row.email),
      phone: row.phone ? decryptField(row.phone) : row.phone,
      message: row.message ? decryptField(row.message) : row.message,
    };
  }

  // ================================================================
  // Wound Care Referrals (PHI -- encrypted at rest)
  // ================================================================

  async createWoundCareReferral(insertReferral: InsertWoundCareReferral): Promise<WoundCareReferral> {
    const encrypted = {
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
    const [referral] = await db.insert(woundCareReferrals).values(encrypted).returning();
    return this.decryptWoundCareReferral(referral);
  }

  async getWoundCareReferrals(): Promise<WoundCareReferral[]> {
    const rows = await db.select().from(woundCareReferrals).orderBy(desc(woundCareReferrals.createdAt));
    return rows.map((r) => this.decryptWoundCareReferral(r));
  }

  private decryptWoundCareReferral(row: WoundCareReferral): WoundCareReferral {
    return {
      ...row,
      providerName: decryptField(row.providerName),
      email: decryptField(row.email),
      phone: row.phone ? decryptField(row.phone) : row.phone,
      patientName: decryptField(row.patientName),
      patientDob: decryptField(row.patientDob),
      diagnosisWoundType: decryptField(row.diagnosisWoundType),
      notes: row.notes ? decryptField(row.notes) : row.notes,
    };
  }

  // ================================================================
  // Admin Users
  // ================================================================

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<void> {
    await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id));
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(adminUsers.name);
  }

  // ================================================================
  // Sessions (HIPAA 164.312(a)(2)(iii), 164.312(d))
  // ================================================================

  async createAdminSession(
    userId: number, token: string, expiresAt: Date,
    ipAddress?: string, userAgent?: string
  ): Promise<AdminSession> {
    const [session] = await db.insert(adminSessions).values({
      userId, token, expiresAt,
      lastActivityAt: new Date(),
      ipAddress: ipAddress || null,
      userAgent: userAgent ? userAgent.substring(0, 500) : null,
    }).returning();
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const [session] = await db.select().from(adminSessions).where(eq(adminSessions.token, token));
    if (!session) return undefined;

    // Check absolute expiration
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return undefined;
    }

    return session;
  }

  async updateSessionActivity(token: string, timestamp: Date): Promise<void> {
    await db.update(adminSessions)
      .set({ lastActivityAt: timestamp })
      .where(eq(adminSessions.token, token));
  }

  async deleteAdminSession(token: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  async deleteUserSessions(userId: number): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.userId, userId));
  }

  async cleanExpiredSessions(): Promise<number> {
    const now = new Date();
    const inactivityCutoff = new Date(now.getTime() - 15 * 60 * 1000);

    // Delete expired or inactive sessions
    const result = await db.delete(adminSessions).where(
      eq(adminSessions.expiresAt, adminSessions.expiresAt) // Drizzle needs a base; we'll use raw
    ).returning();

    // Manual approach: delete expired + inactive
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, now));
    await db.delete(adminSessions).where(lt(adminSessions.lastActivityAt, inactivityCutoff));

    return 0; // Count not easily retrievable with dual deletes
  }

  // ================================================================
  // Login Attempts (HIPAA 164.312(a)(1))
  // ================================================================

  async recordLoginAttempt(email: string, ipAddress: string, success: boolean): Promise<void> {
    await db.insert(loginAttempts).values({
      email,
      ipAddress,
      success: success ? 1 : 0,
    });
  }

  async getRecentFailedAttempts(email: string, windowMs: number): Promise<number> {
    const cutoff = new Date(Date.now() - windowMs);
    const attempts = await db.select().from(loginAttempts)
      .where(and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.success, 0),
        gte(loginAttempts.attemptedAt, cutoff)
      ));
    return attempts.length;
  }

  // ================================================================
  // Password History (HIPAA 164.312(d))
  // ================================================================

  async addPasswordHistory(userId: number, hash: string): Promise<void> {
    await db.insert(passwordHistory).values({ userId, passwordHash: hash });
  }

  async getPasswordHistory(userId: number, limit: number): Promise<PasswordHistoryEntry[]> {
    return await db.select().from(passwordHistory)
      .where(eq(passwordHistory.userId, userId))
      .orderBy(desc(passwordHistory.createdAt))
      .limit(limit);
  }

  // ================================================================
  // Practices
  // ================================================================

  async getPractices(): Promise<Practice[]> {
    return await db.select().from(practices).orderBy(practices.name);
  }

  async createPractice(insertPractice: InsertPractice): Promise<Practice> {
    const [practice] = await db.insert(practices).values(insertPractice).returning();
    return practice;
  }

  // ================================================================
  // Program Snapshots
  // ================================================================

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

  // ================================================================
  // Call Sessions (Ambient AI -- PHI encrypted at rest)
  // ================================================================

  async createCallSession(session: InsertCallSession): Promise<CallSession> {
    const encrypted = {
      ...session,
      patientReference: session.patientReference ? encryptField(session.patientReference) : null,
      patientReferenceHash: session.patientReference ? hashForSearch(session.patientReference) : null,
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [row] = await db.insert(callSessions).values(encrypted).returning();
    return this.decryptCallSession(row);
  }

  async getCallSession(id: number): Promise<CallSession | undefined> {
    const [row] = await db.select().from(callSessions).where(eq(callSessions.id, id));
    if (!row) return undefined;
    return this.decryptCallSession(row);
  }

  async getCallSessions(filters?: { clinicianId?: number; practiceId?: number; programType?: string; status?: string }): Promise<CallSession[]> {
    const conditions = [];
    if (filters?.clinicianId) conditions.push(eq(callSessions.clinicianId, filters.clinicianId));
    if (filters?.practiceId) conditions.push(eq(callSessions.practiceId, filters.practiceId));
    if (filters?.programType) conditions.push(eq(callSessions.programType, filters.programType));
    if (filters?.status) conditions.push(eq(callSessions.status, filters.status));

    let rows;
    if (conditions.length > 0) {
      rows = await db.select().from(callSessions).where(and(...conditions)).orderBy(desc(callSessions.createdAt));
    } else {
      rows = await db.select().from(callSessions).orderBy(desc(callSessions.createdAt));
    }
    return rows.map((r) => this.decryptCallSession(r));
  }

  async updateCallSession(id: number, updates: Partial<CallSession>): Promise<void> {
    const encrypted: any = { ...updates, updatedAt: new Date() };
    if (updates.patientReference) {
      encrypted.patientReference = encryptField(updates.patientReference);
      encrypted.patientReferenceHash = hashForSearch(updates.patientReference);
    }
    await db.update(callSessions).set(encrypted).where(eq(callSessions.id, id));
  }

  private decryptCallSession(row: CallSession): CallSession {
    return {
      ...row,
      patientReference: row.patientReference ? decryptField(row.patientReference) : row.patientReference,
    };
  }

  // ================================================================
  // Transcripts (PHI encrypted at rest)
  // ================================================================

  async createTranscript(transcript: InsertTranscript): Promise<Transcript> {
    const encrypted = {
      ...transcript,
      content: encryptField(transcript.content),
      segments: transcript.segments ? encryptField(transcript.segments) : null,
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [row] = await db.insert(transcripts).values(encrypted).returning();
    return this.decryptTranscript(row);
  }

  async getTranscriptByCallSession(callSessionId: number): Promise<Transcript | undefined> {
    const [row] = await db.select().from(transcripts).where(eq(transcripts.callSessionId, callSessionId));
    if (!row) return undefined;
    return this.decryptTranscript(row);
  }

  async updateTranscript(id: number, updates: Partial<Transcript>): Promise<void> {
    const encrypted: any = { ...updates };
    if (updates.content) encrypted.content = encryptField(updates.content);
    if (updates.segments) encrypted.segments = encryptField(updates.segments);
    await db.update(transcripts).set(encrypted).where(eq(transcripts.id, id));
  }

  private decryptTranscript(row: Transcript): Transcript {
    return {
      ...row,
      content: decryptField(row.content),
      segments: row.segments ? decryptField(row.segments) : row.segments,
    };
  }

  // ================================================================
  // SOAP Notes (PHI encrypted at rest)
  // ================================================================

  async createSoapNote(note: InsertSoapNote): Promise<SoapNote> {
    const encrypted = {
      ...note,
      subjective: encryptField(note.subjective),
      objective: encryptField(note.objective),
      assessment: encryptField(note.assessment),
      plan: encryptField(note.plan),
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [row] = await db.insert(soapNotes).values(encrypted).returning();
    return this.decryptSoapNote(row);
  }

  async getSoapNoteByCallSession(callSessionId: number): Promise<SoapNote | undefined> {
    const [row] = await db.select().from(soapNotes).where(eq(soapNotes.callSessionId, callSessionId));
    if (!row) return undefined;
    return this.decryptSoapNote(row);
  }

  async updateSoapNote(id: number, updates: Partial<SoapNote>): Promise<void> {
    const encrypted: any = { ...updates, updatedAt: new Date() };
    if (updates.subjective) encrypted.subjective = encryptField(updates.subjective);
    if (updates.objective) encrypted.objective = encryptField(updates.objective);
    if (updates.assessment) encrypted.assessment = encryptField(updates.assessment);
    if (updates.plan) encrypted.plan = encryptField(updates.plan);
    await db.update(soapNotes).set(encrypted).where(eq(soapNotes.id, id));
  }

  private decryptSoapNote(row: SoapNote): SoapNote {
    return {
      ...row,
      subjective: decryptField(row.subjective),
      objective: decryptField(row.objective),
      assessment: decryptField(row.assessment),
      plan: decryptField(row.plan),
    };
  }

  // ================================================================
  // Time Entries
  // ================================================================

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const encrypted = {
      ...entry,
      notes: entry.notes ? encryptField(entry.notes) : null,
      encryptionKeyId: isEncryptionConfigured() ? getCurrentKeyId() : null,
    };
    const [row] = await db.insert(timeEntries).values(encrypted).returning();
    return this.decryptTimeEntry(row);
  }

  async getTimeEntries(filters?: { clinicianId?: number; practiceId?: number; programType?: string; date?: string; month?: string; year?: number }): Promise<TimeEntry[]> {
    const conditions = [];
    if (filters?.clinicianId) conditions.push(eq(timeEntries.clinicianId, filters.clinicianId));
    if (filters?.practiceId) conditions.push(eq(timeEntries.practiceId, filters.practiceId));
    if (filters?.programType) conditions.push(eq(timeEntries.programType, filters.programType));
    if (filters?.date) conditions.push(eq(timeEntries.date, filters.date));

    let rows;
    if (conditions.length > 0) {
      rows = await db.select().from(timeEntries).where(and(...conditions)).orderBy(desc(timeEntries.createdAt));
    } else {
      rows = await db.select().from(timeEntries).orderBy(desc(timeEntries.createdAt));
    }
    return rows.map((r) => this.decryptTimeEntry(r));
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  private decryptTimeEntry(row: TimeEntry): TimeEntry {
    return {
      ...row,
      notes: row.notes ? decryptField(row.notes) : row.notes,
    };
  }
}

export const storage = new DatabaseStorage();
