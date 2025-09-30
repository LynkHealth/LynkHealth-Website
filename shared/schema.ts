import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organizationType: text("organization_type").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

// Night coverage inquiry table for overnight on-call service
export const nightCoverageInquiries = pgTable("night_coverage_inquiries", {
  id: serial("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  contactName: text("contact_name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  careSetting: text("care_setting").notNull(),
  expectedVolume: text("expected_volume").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNightCoverageInquirySchema = createInsertSchema(nightCoverageInquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertNightCoverageInquiry = z.infer<typeof insertNightCoverageInquirySchema>;
export type NightCoverageInquiry = typeof nightCoverageInquiries.$inferSelect;

// Wound care referrals table for chronic wound management service
export const woundCareReferrals = pgTable("wound_care_referrals", {
  id: serial("id").primaryKey(),
  providerName: text("provider_name").notNull(),
  organization: text("organization").notNull(),
  role: text("role"),
  email: text("email").notNull(),
  phone: text("phone"),
  patientName: text("patient_name").notNull(),
  patientDob: text("patient_dob").notNull(),
  diagnosisWoundType: text("diagnosis_wound_type").notNull(),
  careSetting: text("care_setting").notNull(),
  urgency: text("urgency").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWoundCareReferralSchema = createInsertSchema(woundCareReferrals).omit({
  id: true,
  createdAt: true,
});

export type InsertWoundCareReferral = z.infer<typeof insertWoundCareReferralSchema>;
export type WoundCareReferral = typeof woundCareReferrals.$inferSelect;

// Keep existing users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
