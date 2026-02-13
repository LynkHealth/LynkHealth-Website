import { pgTable, text, serial, timestamp, integer, varchar, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const PROGRAM_TYPES = ["CCM", "PCM", "BHI", "RPM", "RTM", "TCM", "APCM", "AWV", "CCCM", "CCO"] as const;
export type ProgramType = typeof PROGRAM_TYPES[number];

export const ENROLLMENT_STATUSES = ["enrolled", "not_enrolled", "inactive", "deceased", "discharged", "declined", "pending_consent"] as const;
export type EnrollmentStatus = typeof ENROLLMENT_STATUSES[number];

export const USER_ROLES = [
  "super_admin",
  "admin",
  "care_coordinator",
  "enrollment_specialist",
  "billing_specialist",
  "practice_admin",
] as const;
export type UserRole = typeof USER_ROLES[number];

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
  role: text("role").notNull().default("admin"),
  status: text("status").notNull().default("active"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  lastPasswordChange: timestamp("last_password_change"),
  mustChangePassword: integer("must_change_password").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const userPracticeAssignments = pgTable("user_practice_assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  practiceId: integer("practice_id").notNull(),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserPracticeAssignmentSchema = createInsertSchema(userPracticeAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertUserPracticeAssignment = z.infer<typeof insertUserPracticeAssignmentSchema>;
export type UserPracticeAssignment = typeof userPracticeAssignments.$inferSelect;

export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  permission: text("permission").notNull(),
  allowed: integer("allowed").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
  id: true,
  createdAt: true,
});

export type InsertUserPermission = z.infer<typeof insertUserPermissionSchema>;
export type UserPermission = typeof userPermissions.$inferSelect;

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivity: timestamp("last_activity").defaultNow(),
  ipAddress: text("ip_address"),
  activePracticeId: integer("active_practice_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

export const passwordHistory = pgTable("password_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordHistory = typeof passwordHistory.$inferSelect;

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  ipAddress: text("ip_address"),
  success: integer("success").notNull().default(0),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LoginAttempt = typeof loginAttempts.$inferSelect;

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userEmail: text("user_email"),
  userRole: text("user_role"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  outcome: text("outcome").default("success"),
  phiAccessed: integer("phi_accessed").default(0),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

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

export const revenueSnapshots = pgTable("revenue_snapshots", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull(),
  department: text("department"),
  programType: text("program_type").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  claimCount: integer("claim_count").default(0),
  concatenatedCount: integer("concatenated_count").default(0),
  nonConcatenatedCount: integer("non_concatenated_count").default(0),
  totalRevenue: integer("total_revenue").default(0),
  source: text("source").default("thoroughcare"),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRevenueSnapshotSchema = createInsertSchema(revenueSnapshots).omit({
  id: true,
  createdAt: true,
});

export type InsertRevenueSnapshot = z.infer<typeof insertRevenueSnapshotSchema>;
export type RevenueSnapshot = typeof revenueSnapshots.$inferSelect;

export const revenueByCode = pgTable("revenue_by_code", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull(),
  department: text("department"),
  programType: text("program_type").notNull(),
  cptCode: text("cpt_code").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  claimCount: integer("claim_count").default(0),
  totalRevenue: integer("total_revenue").default(0),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRevenueByCodeSchema = createInsertSchema(revenueByCode).omit({
  id: true,
  createdAt: true,
});

export type InsertRevenueByCode = z.infer<typeof insertRevenueByCodeSchema>;
export type RevenueByCode = typeof revenueByCode.$inferSelect;

export const cptBillingCodes = pgTable("cpt_billing_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
  program: text("program").notNull(),
  rateCents: integer("rate_cents").notNull(),
  effectiveYear: integer("effective_year").notNull(),
  state: text("state").notNull().default("MS"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCptBillingCodeSchema = createInsertSchema(cptBillingCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCptBillingCode = z.infer<typeof insertCptBillingCodeSchema>;
export type CptBillingCode = typeof cptBillingCodes.$inferSelect;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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

// ============================================================
// Clinical Platform Tables
// ============================================================

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull(),
  mrn: text("mrn"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  primaryProviderId: integer("primary_provider_id"),
  assignedCareManagerId: integer("assigned_care_manager_id"),
  riskLevel: text("risk_level").default("low"),
  status: text("status").notNull().default("active"),
  consentDate: text("consent_date"),
  consentStatus: text("consent_status").default("pending"),
  notes: text("notes"),
  thoroughcareId: text("thoroughcare_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export const patientConditions = pgTable("patient_conditions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  icdCode: text("icd_code").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  onsetDate: text("onset_date"),
  isPrimary: integer("is_primary").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientConditionSchema = createInsertSchema(patientConditions).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientCondition = z.infer<typeof insertPatientConditionSchema>;
export type PatientCondition = typeof patientConditions.$inferSelect;

export const patientMedications = pgTable("patient_medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  name: text("name").notNull(),
  dosage: text("dosage"),
  frequency: text("frequency"),
  prescribedBy: text("prescribed_by"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientMedicationSchema = createInsertSchema(patientMedications).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientMedication = z.infer<typeof insertPatientMedicationSchema>;
export type PatientMedication = typeof patientMedications.$inferSelect;

export const patientAllergies = pgTable("patient_allergies", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  allergen: text("allergen").notNull(),
  reaction: text("reaction"),
  severity: text("severity").default("moderate"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientAllergySchema = createInsertSchema(patientAllergies).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientAllergy = z.infer<typeof insertPatientAllergySchema>;
export type PatientAllergy = typeof patientAllergies.$inferSelect;

export const patientVitals = pgTable("patient_vitals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  vitalType: text("vital_type").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  recordedBy: integer("recorded_by"),
  source: text("source").default("manual"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientVitalSchema = createInsertSchema(patientVitals).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientVital = z.infer<typeof insertPatientVitalSchema>;
export type PatientVital = typeof patientVitals.$inferSelect;

export const patientInsurance = pgTable("patient_insurance", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  insuranceType: text("insurance_type").notNull().default("primary"),
  payerName: text("payer_name").notNull(),
  memberId: text("member_id"),
  groupNumber: text("group_number"),
  planName: text("plan_name"),
  effectiveDate: text("effective_date"),
  terminationDate: text("termination_date"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientInsuranceSchema = createInsertSchema(patientInsurance).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientInsurance = z.infer<typeof insertPatientInsuranceSchema>;
export type PatientInsurance = typeof patientInsurance.$inferSelect;

export const programEnrollments = pgTable("program_enrollments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  practiceId: integer("practice_id").notNull(),
  programType: text("program_type").notNull(),
  status: text("status").notNull().default("enrolled"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  inactiveAt: timestamp("inactive_at"),
  inactiveReason: text("inactive_reason"),
  consentObtained: integer("consent_obtained").default(0),
  consentDate: text("consent_date"),
  assignedCareManagerId: integer("assigned_care_manager_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProgramEnrollmentSchema = createInsertSchema(programEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProgramEnrollment = z.infer<typeof insertProgramEnrollmentSchema>;
export type ProgramEnrollment = typeof programEnrollments.$inferSelect;

export const carePlans = pgTable("care_plans", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  enrollmentId: integer("enrollment_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  createdBy: integer("created_by"),
  signedOffBy: integer("signed_off_by"),
  signedOffAt: timestamp("signed_off_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCarePlanSchema = createInsertSchema(carePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCarePlan = z.infer<typeof insertCarePlanSchema>;
export type CarePlan = typeof carePlans.$inferSelect;

export const carePlanItems = pgTable("care_plan_items", {
  id: serial("id").primaryKey(),
  carePlanId: integer("care_plan_id").notNull(),
  itemType: text("item_type").notNull().default("goal"),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  targetDate: text("target_date"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarePlanItemSchema = createInsertSchema(carePlanItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCarePlanItem = z.infer<typeof insertCarePlanItemSchema>;
export type CarePlanItem = typeof carePlanItems.$inferSelect;

export const timeLogs = pgTable("time_logs", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  userId: integer("user_id").notNull(),
  programType: text("program_type").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  activityType: text("activity_type").notNull().default("care_coordination"),
  description: text("description"),
  logDate: text("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTimeLogSchema = createInsertSchema(timeLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertTimeLog = z.infer<typeof insertTimeLogSchema>;
export type TimeLog = typeof timeLogs.$inferSelect;

export const clinicalTasks = pgTable("clinical_tasks", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id"),
  assignedTo: integer("assigned_to"),
  createdBy: integer("created_by").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  dueDate: text("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClinicalTaskSchema = createInsertSchema(clinicalTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClinicalTask = z.infer<typeof insertClinicalTaskSchema>;
export type ClinicalTask = typeof clinicalTasks.$inferSelect;

export const patientAssessments = pgTable("patient_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  assessmentType: text("assessment_type").notNull(),
  score: integer("score"),
  maxScore: integer("max_score"),
  riskLevel: text("risk_level"),
  responses: text("responses"),
  completedBy: integer("completed_by"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientAssessmentSchema = createInsertSchema(patientAssessments).omit({
  id: true,
  createdAt: true,
});

export type InsertPatientAssessment = z.infer<typeof insertPatientAssessmentSchema>;
export type PatientAssessment = typeof patientAssessments.$inferSelect;

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id"),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  eventType: text("event_type").notNull().default("call"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("scheduled"),
  outcome: text("outcome"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  enrollmentId: integer("enrollment_id"),
  practiceId: integer("practice_id").notNull(),
  programType: text("program_type").notNull(),
  cptCode: text("cpt_code").notNull(),
  icdCodes: text("icd_codes"),
  serviceDate: text("service_date").notNull(),
  totalMinutes: integer("total_minutes").default(0),
  amountCents: integer("amount_cents").default(0),
  status: text("status").notNull().default("ready"),
  submittedAt: timestamp("submitted_at"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
});

export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;

// ============================================================
// Care Plan Templates
// ============================================================

export const carePlanTemplates = pgTable("care_plan_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  programType: text("program_type").notNull(),
  description: text("description"),
  isActive: integer("is_active").notNull().default(1),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCarePlanTemplateSchema = createInsertSchema(carePlanTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCarePlanTemplate = z.infer<typeof insertCarePlanTemplateSchema>;
export type CarePlanTemplate = typeof carePlanTemplates.$inferSelect;

export const carePlanTemplateItems = pgTable("care_plan_template_items", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  itemType: text("item_type").notNull().default("goal"),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarePlanTemplateItemSchema = createInsertSchema(carePlanTemplateItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCarePlanTemplateItem = z.infer<typeof insertCarePlanTemplateItemSchema>;
export type CarePlanTemplateItem = typeof carePlanTemplateItems.$inferSelect;

export const FORM_STATUSES = ["pending", "approved", "rejected"] as const;
export type FormStatus = typeof FORM_STATUSES[number];

export const poorEngagementForms = pgTable("poor_engagement_forms", {
  id: serial("id").primaryKey(),
  careManagerName: text("care_manager_name").notNull(),
  clinic: text("clinic").notNull(),
  patientName: text("patient_name").notNull(),
  patientDob: text("patient_dob").notNull(),
  guidelinesFollowed: boolean("guidelines_followed").notNull().default(false),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  submittedBy: integer("submitted_by"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPoorEngagementFormSchema = createInsertSchema(poorEngagementForms).omit({
  id: true,
  createdAt: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewNotes: true,
});

export type InsertPoorEngagementForm = z.infer<typeof insertPoorEngagementFormSchema>;
export type PoorEngagementForm = typeof poorEngagementForms.$inferSelect;

export const billingEvaluationForms = pgTable("billing_evaluation_forms", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientDob: text("patient_dob").notNull(),
  clinicPartnerName: text("clinic_partner_name").notNull(),
  employeeName: text("employee_name").notNull(),
  description: text("description").notNull(),
  issueType: text("issue_type").notNull(),
  issueTypeOther: text("issue_type_other"),
  patientCommunicated: boolean("patient_communicated").notNull().default(false),
  requestedAction: text("requested_action").notNull(),
  status: text("status").notNull().default("pending"),
  submittedBy: integer("submitted_by"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBillingEvaluationFormSchema = createInsertSchema(billingEvaluationForms).omit({
  id: true,
  createdAt: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewNotes: true,
});

export type InsertBillingEvaluationForm = z.infer<typeof insertBillingEvaluationFormSchema>;
export type BillingEvaluationForm = typeof billingEvaluationForms.$inferSelect;

// ============================================================
// Invoices
// ============================================================

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  practiceId: integer("practice_id").notNull(),
  practiceName: text("practice_name").notNull(),
  department: text("department"),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull().default(0),
  totalClaims: integer("total_claims").notNull().default(0),
  status: text("status").notNull().default("pending_review"),
  generatedAt: timestamp("generated_at").defaultNow(),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  generatedAt: true,
  reviewedBy: true,
  reviewedAt: true,
  approvedBy: true,
  approvedAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  programType: text("program_type").notNull(),
  cptCode: text("cpt_code").notNull(),
  description: text("description"),
  claimCount: integer("claim_count").notNull().default(0),
  rateCents: integer("rate_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
});

export const insertInvoiceLineItemSchema = createInsertSchema(invoiceLineItems).omit({
  id: true,
});

export type InsertInvoiceLineItem = z.infer<typeof insertInvoiceLineItemSchema>;
export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;

// ============================================================
// Invoice Rates (custom billing rates per CPT code for invoicing)
// ============================================================

export const invoiceRates = pgTable("invoice_rates", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id"),
  cptCode: text("cpt_code").notNull(),
  program: text("program").notNull(),
  description: text("description"),
  claimRateCents: integer("claim_rate_cents").notNull().default(0),
  invoiceRateCents: integer("invoice_rate_cents").notNull().default(0),
  effectiveYear: integer("effective_year").notNull().default(2026),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceRateSchema = createInsertSchema(invoiceRates).omit({
  id: true,
  updatedAt: true,
});

export type InsertInvoiceRate = z.infer<typeof insertInvoiceRateSchema>;
export type InvoiceRate = typeof invoiceRates.$inferSelect;

// ============================================================
// Staff Time Logs (ThoroughCare synced practitioner time data)
// ============================================================

export const staffRoleOverrides = pgTable("staff_role_overrides", {
  id: serial("id").primaryKey(),
  staffTcId: text("staff_tc_id").notNull(),
  staffName: text("staff_name").notNull(),
  overrideRole: text("override_role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStaffRoleOverrideSchema = createInsertSchema(staffRoleOverrides).omit({
  id: true,
  createdAt: true,
});

export type InsertStaffRoleOverride = z.infer<typeof insertStaffRoleOverrideSchema>;
export type StaffRoleOverride = typeof staffRoleOverrides.$inferSelect;

export const tcStaffTimeLogs = pgTable("tc_staff_time_logs", {
  id: serial("id").primaryKey(),
  tcTaskId: text("tc_task_id").notNull(),
  practiceId: integer("practice_id"),
  department: text("department"),
  patientTcId: text("patient_tc_id"),
  programType: text("program_type").notNull(),
  staffTcId: text("staff_tc_id"),
  staffName: text("staff_name"),
  staffRole: text("staff_role"),
  minutes: integer("minutes").notNull().default(0),
  logDate: text("log_date"),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  syncedAt: timestamp("synced_at").defaultNow(),
});

export const insertTcStaffTimeLogSchema = createInsertSchema(tcStaffTimeLogs).omit({
  id: true,
  syncedAt: true,
});

export type InsertTcStaffTimeLog = z.infer<typeof insertTcStaffTimeLogSchema>;
export type TcStaffTimeLog = typeof tcStaffTimeLogs.$inferSelect;

export const eraUploads = pgTable("era_uploads", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull(),
  department: text("department"),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  filename: text("filename").notNull(),
  status: text("status").notNull().default("processing"),
  totalClaims: integer("total_claims").default(0),
  totalPaidCents: integer("total_paid_cents").default(0),
  totalBilledCents: integer("total_billed_cents").default(0),
  totalAdjustmentCents: integer("total_adjustment_cents").default(0),
  matchedClaims: integer("matched_claims").default(0),
  unmatchedClaims: integer("unmatched_claims").default(0),
  uploadedBy: integer("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  rawContent: text("raw_content"),
  parseErrors: text("parse_errors"),
});

export const insertEraUploadSchema = createInsertSchema(eraUploads).omit({
  id: true,
  uploadedAt: true,
});

export type InsertEraUpload = z.infer<typeof insertEraUploadSchema>;
export type EraUpload = typeof eraUploads.$inferSelect;

export const eraLineItems = pgTable("era_line_items", {
  id: serial("id").primaryKey(),
  uploadId: integer("upload_id").notNull(),
  claimId: text("claim_id"),
  patientName: text("patient_name"),
  payerClaimId: text("payer_claim_id"),
  serviceDate: text("service_date"),
  cptCode: text("cpt_code"),
  modifier: text("modifier"),
  units: integer("units").default(1),
  billedCents: integer("billed_cents").default(0),
  paidCents: integer("paid_cents").default(0),
  allowedCents: integer("allowed_cents").default(0),
  adjustmentCents: integer("adjustment_cents").default(0),
  adjustmentReason: text("adjustment_reason"),
  programType: text("program_type"),
  matchStatus: text("match_status").default("pending"),
  systemRevenueCents: integer("system_revenue_cents"),
  varianceCents: integer("variance_cents"),
  notes: text("notes"),
});

export const insertEraLineItemSchema = createInsertSchema(eraLineItems).omit({
  id: true,
});

export type InsertEraLineItem = z.infer<typeof insertEraLineItemSchema>;
export type EraLineItem = typeof eraLineItems.$inferSelect;
