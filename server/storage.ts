import { users, contactInquiries, nightCoverageInquiries, woundCareReferrals, type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, type NightCoverageInquiry, type InsertNightCoverageInquiry, type WoundCareReferral, type InsertWoundCareReferral } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [inquiry] = await db
      .insert(contactInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db
      .select()
      .from(contactInquiries)
      .orderBy(contactInquiries.createdAt);
  }

  async createNightCoverageInquiry(insertInquiry: InsertNightCoverageInquiry): Promise<NightCoverageInquiry> {
    const [inquiry] = await db
      .insert(nightCoverageInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getNightCoverageInquiries(): Promise<NightCoverageInquiry[]> {
    return await db
      .select()
      .from(nightCoverageInquiries)
      .orderBy(nightCoverageInquiries.createdAt);
  }

  async createWoundCareReferral(insertReferral: InsertWoundCareReferral): Promise<WoundCareReferral> {
    const [referral] = await db
      .insert(woundCareReferrals)
      .values(insertReferral)
      .returning();
    return referral;
  }

  async getWoundCareReferrals(): Promise<WoundCareReferral[]> {
    return await db
      .select()
      .from(woundCareReferrals)
      .orderBy(woundCareReferrals.createdAt);
  }
}

export const storage = new DatabaseStorage();