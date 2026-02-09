import { users, contactInquiries, nightCoverageInquiries, woundCareReferrals, adminUsers, adminSessions, practices, programSnapshots, revenueSnapshots, cptBillingCodes, type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, type NightCoverageInquiry, type InsertNightCoverageInquiry, type WoundCareReferral, type InsertWoundCareReferral, type AdminUser, type InsertAdminUser, type AdminSession, type Practice, type InsertPractice, type ProgramSnapshot, type InsertProgramSnapshot, type RevenueSnapshot, type InsertRevenueSnapshot, type CptBillingCode, type InsertCptBillingCode } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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
  getCptBillingCodes(effectiveYear?: number): Promise<CptBillingCode[]>;
  getCptBillingCode(id: number): Promise<CptBillingCode | undefined>;
  createCptBillingCode(code: InsertCptBillingCode): Promise<CptBillingCode>;
  updateCptBillingCode(id: number, updates: Partial<InsertCptBillingCode>): Promise<CptBillingCode | undefined>;
  deleteCptBillingCode(id: number): Promise<void>;
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
}

export const storage = new DatabaseStorage();
