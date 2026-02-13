import { pgTable, text, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================
// PUBLIC FORM TABLES
// ============================================================

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organizationType: text("organization_type").notNull(),
  message: text("message"),
  emailHash: text("email_hash"),
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  emailHash: true,
  encryptionKeyId: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

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
  emailHash: text("email_hash"),
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNightCoverageInquirySchema = createInsertSchema(nightCoverageInquiries).omit({
  id: true,
  createdAt: true,
  emailHash: true,
  encryptionKeyId: true,
});

export type InsertNightCoverageInquiry = z.infer<typeof insertNightCoverageInquirySchema>;
export type NightCoverageInquiry = typeof nightCoverageInquiries.$inferSelect;

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
  patientNameHash: text("patient_name_hash"),
  patientDobHash: text("patient_dob_hash"),
  emailHash: text("email_hash"),
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWoundCareReferralSchema = createInsertSchema(woundCareReferrals).omit({
  id: true,
  createdAt: true,
  patientNameHash: true,
  patientDobHash: true,
  emailHash: true,
  encryptionKeyId: true,
});

export type InsertWoundCareReferral = z.infer<typeof insertWoundCareReferralSchema>;
export type WoundCareReferral = typeof woundCareReferrals.$inferSelect;

// ============================================================
// USERS & AUTH
// ============================================================

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

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("viewer"),
  isActive: integer("is_active").notNull().default(1),
  passwordChangedAt: timestamp("password_changed_at"),
  lastLoginAt: timestamp("last_login_at"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  isActive: true,
  passwordChangedAt: true,
  lastLoginAt: true,
  createdBy: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivityAt: timestamp("last_activity_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

// ============================================================
// PASSWORD HISTORY (HIPAA 164.312(d) -- prevent reuse)
// ============================================================

export const passwordHistory = pgTable("password_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordHistoryEntry = typeof passwordHistory.$inferSelect;

// ============================================================
// LOGIN ATTEMPTS (HIPAA 164.312(a)(1) -- persistent lockout)
// ============================================================

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  ipAddress: text("ip_address"),
  success: integer("success").notNull().default(0),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

export type LoginAttempt = typeof loginAttempts.$inferSelect;

// ============================================================
// AUDIT LOGS (HIPAA 164.312(b) -- Audit Controls)
// ============================================================

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  // WHO
  userId: integer("user_id"),
  userEmail: text("user_email"),
  userRole: text("user_role"),
  // WHAT
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  // WHERE
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // WHEN
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  // DETAILS
  details: text("details"),
  // OUTCOME
  outcome: text("outcome").notNull().default("success"),
  // PHI indicator
  phiAccessed: integer("phi_accessed").notNull().default(0),
});

export type AuditLog = typeof auditLogs.$inferSelect;

// ============================================================
// PRACTICES & PROGRAM DATA
// ============================================================

export const practices = pgTable("practices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  thoroughcareId: integer("thoroughcare_id"),
  thoroughcareAlias: text("thoroughcare_alias"),
  location: text("location"),
  npi: text("npi"),
  status: text("status").notNull().default("active"),
  totalPatients: integer("total_patients").default(0),
  departments: text("departments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPracticeSchema = createInsertSchema(practices).omit({
  id: true,
  createdAt: true,
});

export type InsertPractice = z.infer<typeof insertPracticeSchema>;
export type Practice = typeof practices.$inferSelect;

export const tcSyncLog = pgTable("tc_sync_log", {
  id: serial("id").primaryKey(),
  syncType: text("sync_type").notNull(),
  status: text("status").notNull().default("running"),
  recordsProcessed: integer("records_processed").default(0),
  details: text("details"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type TcSyncLog = typeof tcSyncLog.$inferSelect;

export const programSnapshots = pgTable("program_snapshots", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull(),
  department: text("department"),
  programType: text("program_type").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  patientsEnrolled: integer("patients_enrolled").default(0),
  notEnrolled: integer("not_enrolled").default(0),
  inactive: integer("inactive").default(0),
  mins0: integer("mins_0").default(0),
  mins1to4: integer("mins_1_to_4").default(0),
  mins1to9: integer("mins_1_to_9").default(0),
  mins1to29: integer("mins_1_to_29").default(0),
  mins5to9: integer("mins_5_to_9").default(0),
  mins10to14: integer("mins_10_to_14").default(0),
  mins10to19: integer("mins_10_to_19").default(0),
  mins15to19: integer("mins_15_to_19").default(0),
  mins20to39: integer("mins_20_to_39").default(0),
  mins20Plus: integer("mins_20_plus").default(0),
  mins30to59: integer("mins_30_to_59").default(0),
  mins40to59: integer("mins_40_to_59").default(0),
  mins40Plus: integer("mins_40_plus").default(0),
  mins60Plus: integer("mins_60_plus").default(0),
  patientsWithDevices: integer("patients_with_devices").default(0),
  patientsTakingReadings: integer("patients_taking_readings").default(0),
  qualifiedSuppliedDevice: integer("qualified_supplied_device").default(0),
  dueForVisit: integer("due_for_visit").default(0),
  inProgress: integer("in_progress").default(0),
  hraSent: integer("hra_sent").default(0),
  hraReceived: integer("hra_received").default(0),
  readyToFinalize: integer("ready_to_finalize").default(0),
  unknownDates: integer("unknown_dates").default(0),
  source: text("source").default("manual"),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProgramSnapshotSchema = createInsertSchema(programSnapshots).omit({
  id: true,
  createdAt: true,
});

export type InsertProgramSnapshot = z.infer<typeof insertProgramSnapshotSchema>;
export type ProgramSnapshot = typeof programSnapshots.$inferSelect;

// ============================================================
// AMBIENT AI -- Call Recordings, Transcripts, SOAP Notes, Time Tracking
// ============================================================

export const callSessions = pgTable("call_sessions", {
  id: serial("id").primaryKey(),
  clinicianId: integer("clinician_id").notNull(),       // admin_users.id
  practiceId: integer("practice_id"),                    // practices.id (optional)
  patientReference: text("patient_reference"),           // encrypted -- e.g. patient name or MRN
  patientReferenceHash: text("patient_reference_hash"),  // HMAC for search
  programType: text("program_type"),                     // CCM, BHI, RPM, etc.
  callStartedAt: timestamp("call_started_at").notNull(),
  callEndedAt: timestamp("call_ended_at"),
  durationSeconds: integer("duration_seconds"),
  status: text("status").notNull().default("recording"), // recording | transcribing | generating | review | signed | amended
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCallSessionSchema = createInsertSchema(callSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  patientReferenceHash: true,
  encryptionKeyId: true,
});

export type InsertCallSession = z.infer<typeof insertCallSessionSchema>;
export type CallSession = typeof callSessions.$inferSelect;

export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  callSessionId: integer("call_session_id").notNull(),
  content: text("content").notNull(),            // encrypted full transcript text
  segments: text("segments"),                     // encrypted JSON: [{start, end, speaker, text}]
  provider: text("provider"),                     // deepgram | aws_transcribe | manual
  languageCode: text("language_code").default("en-US"),
  confidenceScore: text("confidence_score"),       // overall confidence 0-1
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranscriptSchema = createInsertSchema(transcripts).omit({
  id: true,
  createdAt: true,
  encryptionKeyId: true,
});

export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Transcript = typeof transcripts.$inferSelect;

export const soapNotes = pgTable("soap_notes", {
  id: serial("id").primaryKey(),
  callSessionId: integer("call_session_id").notNull(),
  subjective: text("subjective").notNull(),       // encrypted
  objective: text("objective").notNull(),          // encrypted
  assessment: text("assessment").notNull(),        // encrypted
  plan: text("plan").notNull(),                    // encrypted
  status: text("status").notNull().default("draft"), // draft | reviewed | signed | amended
  reviewedBy: integer("reviewed_by"),              // admin_users.id
  reviewedAt: timestamp("reviewed_at"),
  signedBy: integer("signed_by"),                  // admin_users.id
  signedAt: timestamp("signed_at"),
  aiModel: text("ai_model"),                       // model that generated the note
  aiConfidence: text("ai_confidence"),             // confidence score
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSoapNoteSchema = createInsertSchema(soapNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  encryptionKeyId: true,
  reviewedBy: true,
  reviewedAt: true,
  signedBy: true,
  signedAt: true,
});

export type InsertSoapNote = z.infer<typeof insertSoapNoteSchema>;
export type SoapNote = typeof soapNotes.$inferSelect;

export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  callSessionId: integer("call_session_id"),       // optional link to a call
  clinicianId: integer("clinician_id").notNull(),  // admin_users.id
  practiceId: integer("practice_id"),
  programType: text("program_type").notNull(),     // CCM, BHI, RPM, etc.
  date: text("date").notNull(),                    // YYYY-MM-DD
  durationMinutes: integer("duration_minutes").notNull(),
  notes: text("notes"),                            // encrypted
  encryptionKeyId: text("encryption_key_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  encryptionKeyId: true,
});

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const adminPasswordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: adminPasswordSchema,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
