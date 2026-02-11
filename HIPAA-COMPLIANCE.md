# HIPAA Compliance Documentation — LynkHealth Website

> **Last Updated**: February 2026
> **Status**: Application-level HIPAA controls implemented. **Hosting environment must also be HIPAA-compliant** (see [Hosting Requirements](#hosting-requirements) below).

---

## Table of Contents

1. [Overview](#overview)
2. [HIPAA Controls Implemented](#hipaa-controls-implemented)
3. [Hosting Requirements](#hosting-requirements)
4. [Why Replit Is Not HIPAA-Compliant](#why-replit-is-not-hipaa-compliant)
5. [Recommended HIPAA-Compliant Hosting Providers](#recommended-hipaa-compliant-hosting-providers)
6. [Required Environment Variables](#required-environment-variables)
7. [Deployment Checklist](#deployment-checklist)
8. [Data Flow & Architecture](#data-flow--architecture)

---

## Overview

This application handles **Protected Health Information (PHI)** through wound care referrals and **Personally Identifiable Information (PII)** through contact forms. Under HIPAA (Health Insurance Portability and Accountability Act), any system that stores, processes, or transmits PHI must comply with the Technical Safeguards defined in **45 CFR § 164.312**.

The codebase implements all required application-level HIPAA Technical Safeguards. However, **HIPAA compliance is not just code — it requires the entire infrastructure stack to be compliant**, including hosting, databases, backups, and any third-party services.

---

## HIPAA Controls Implemented

### 1. Audit Controls — § 164.312(b)
**File**: `server/audit.ts`

- Append-only audit logging for all security-relevant events
- 30+ distinct event types covering login, logout, PHI/PII access, user management, permission denials, and configuration changes
- Every log entry captures: timestamp, user ID, action, resource type, IP address, user agent, and PHI-access flag
- All admin API routes emit audit events
- Public form submissions (wound care referrals, contact forms) are logged as PHI_CREATE/PII_CREATE events
- Designed for 6-year retention (HIPAA minimum)

**Audit event categories**:
| Category | Events |
|----------|--------|
| Authentication | LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SESSION_EXPIRED, PASSWORD_CHANGE |
| PHI Access | PHI_CREATE, PHI_READ, PHI_UPDATE, PHI_DELETE, PHI_EXPORT |
| PII Access | PII_CREATE, PII_READ |
| User Management | USER_CREATE, USER_UPDATE, USER_DEACTIVATE, USER_ROLE_CHANGE |
| System | PERMISSION_DENIED, ACCOUNT_LOCKED, CONFIG_CHANGE |

### 2. Access Control — § 164.312(a)(1)
**File**: `server/rbac.ts`

Three-tier Role-Based Access Control (RBAC):

| Role | Permissions |
|------|-------------|
| **viewer** | Dashboard, practices, snapshots (no PHI/PII) |
| **admin** | Viewer + inquiries, referrals, ThoroughCare data, sync, practice management |
| **superadmin** | All permissions including user management and audit log access |

- `requirePermission()` Express middleware enforces access on every route
- Permission denials are audit-logged with the user, IP, and requested resource
- Dashboard endpoint returns only aggregate counts (no PHI), enforcing **minimum necessary access**

### 3. Authentication — § 164.312(d)
**Files**: `server/admin-routes.ts`, `shared/schema.ts`

- **Password complexity**: Minimum 12 characters, must include uppercase, lowercase, number, and special character
- **Password expiry**: 90-day maximum password age; forced password change on first login
- **Password history**: Last 5 passwords tracked; reuse is blocked
- **Account lockout**: 5 failed attempts in 15 minutes triggers temporary lockout (persistent, DB-backed)
- **Single-session enforcement**: New login invalidates all prior sessions

### 4. Session Management — § 164.312(a)(2)(iii)
**Files**: `server/admin-routes.ts`, `client/src/hooks/use-inactivity-timer.ts`

- **httpOnly cookies**: Session tokens stored in httpOnly, Secure, SameSite=Strict cookies (not accessible via JavaScript — prevents XSS token theft)
- **15-minute inactivity timeout**: Server-side enforcement with sliding window
- **4-hour absolute session maximum**: Regardless of activity
- **IP binding**: Sessions are locked to the originating IP address
- **Client-side inactivity timer**: Warning at 13 minutes, auto-logout at 15 minutes
- **Session cleanup**: Background job every 5 minutes removes expired/inactive sessions

### 5. Encryption at Rest — § 164.312(a)(2)(iv)
**File**: `server/encryption.ts`

- **AES-256-GCM** authenticated encryption for all PHI and PII fields
- Field-level encryption (each field encrypted independently with unique IV)
- **Key rotation support**: Versioned key IDs allow seamless key rotation without re-encrypting all data
- **HMAC-SHA256 search hashes**: Deterministic hashes on email, patient name, and DOB enable searching encrypted data without decryption
- **Graceful degradation**: System handles both legacy plaintext and encrypted records during migration

**Encrypted fields**:
- Contact inquiries: firstName, lastName, email, phone, message
- Night coverage inquiries: contactName, email, phone, message
- Wound care referrals: providerName, email, phone, patientName, patientDob, diagnosisWoundType, notes

### 6. Transmission Security — § 164.312(e)(1)
**File**: `server/index.ts`

- **HTTPS enforcement**: Automatic HTTP→HTTPS redirect in production (301)
- **HSTS**: Strict-Transport-Security header with 1-year max-age, includeSubDomains, preload
- **Content Security Policy**: Restrictive CSP via helmet
- **CORS**: Configurable allowed origins with credentials support
- **Rate limiting**: 100 requests per 15 minutes per IP on all API endpoints

### 7. PHI-Safe Logging
**File**: `server/index.ts`

- Response bodies are **never logged** for PHI/PII endpoints
- Log output shows `[REDACTED]` for all endpoints in the PHI endpoint list
- Error messages in production do not leak internal details (500 errors return generic "Internal Server Error")
- Mailchimp integration logs are sanitized (no email addresses in console output)

---

## Hosting Requirements

For HIPAA compliance, your hosting provider **must**:

| Requirement | Why |
|-------------|-----|
| **Sign a Business Associate Agreement (BAA)** | Legal requirement under HIPAA when a third party handles PHI |
| **Encrypt data at rest** | Database storage, file systems, backups must all be encrypted |
| **Encrypt data in transit** | TLS/SSL for all connections (app ↔ DB, app ↔ client, app ↔ third parties) |
| **Provide access controls** | Restrict who can access the infrastructure (SSH, console, logs) |
| **Maintain audit trails** | Infrastructure-level logging (who accessed what, when) |
| **Have SOC 2 Type II or HITRUST certification** | Industry-standard proof of security controls |
| **Support dedicated/isolated compute** | PHI should not run on shared, multi-tenant infrastructure without proper isolation |
| **Offer compliant backups** | Encrypted, access-controlled, with defined retention |

---

## Why Replit Is Not HIPAA-Compliant

As of February 2026, **Replit cannot be used to host HIPAA-regulated applications** for the following reasons:

1. **No Business Associate Agreement (BAA)**: Replit does not offer BAAs. Without a BAA, hosting PHI on Replit is a direct HIPAA violation.

2. **Shared multi-tenant infrastructure**: Replit runs applications on shared infrastructure without the isolation guarantees required for PHI processing.

3. **No HIPAA/SOC 2/HITRUST certifications**: Replit has not obtained the compliance certifications that demonstrate their infrastructure meets healthcare security standards.

4. **Limited encryption controls**: You cannot verify or control encryption-at-rest for the underlying storage, and Replit's deployment model does not guarantee the level of encryption required for PHI.

5. **Insufficient access controls**: Replit's collaboration features and infrastructure access model are not designed for the strict access controls required by HIPAA.

6. **No infrastructure audit trails**: Replit does not provide the infrastructure-level audit logging needed to demonstrate HIPAA compliance during an audit or breach investigation.

> **Bottom line**: Even though the application code is HIPAA-compliant, deploying it on Replit would make the overall system non-compliant. HIPAA compliance requires **both** the application **and** the hosting environment to meet the standards.

---

## Recommended HIPAA-Compliant Hosting Providers

| Provider | BAA | Notes |
|----------|-----|-------|
| **AWS (Amazon Web Services)** | Yes | Most mature HIPAA offering. Use ECS/Fargate or Elastic Beanstalk. Neon DB is BAA-eligible. |
| **Railway** | Yes (Teams plan) | Simple deployment similar to Replit. Offers BAA on Teams plan. |
| **Render** | Yes (upon request) | Easy Dockerfile/Node.js deployment. BAA available for paid plans. |
| **Fly.io** | Yes | Edge deployment with BAA support. Good for low-latency requirements. |
| **Google Cloud Platform** | Yes | Cloud Run or App Engine. Comprehensive HIPAA support. |
| **Microsoft Azure** | Yes | App Service or Container Instances. Strong healthcare vertical. |
| **DigitalOcean** | Yes (Business plan) | App Platform with BAA on business tier. |

**Database**: Neon (our PostgreSQL provider) offers BAA-eligible plans. Verify your Neon plan includes BAA coverage, or consider AWS RDS PostgreSQL as an alternative.

---

## Required Environment Variables

These must be configured in the hosting environment. **Never commit these values to source control.**

```bash
# Database
DATABASE_URL=postgresql://...          # Neon connection string

# Admin
ADMIN_DEFAULT_PASSWORD=...             # Initial admin password (change on first login)

# PHI Encryption (REQUIRED for HIPAA)
PHI_ENCRYPTION_KEY=<64-hex-chars>      # AES-256 key (32 bytes as hex)
PHI_ENCRYPTION_KEY_ID=<key-version>    # e.g., "v1" — for key rotation tracking
PHI_HMAC_KEY=<64-hex-chars>            # HMAC key for searchable encryption

# ThoroughCare Integration
THOROUGHCARE_CLIENT_ID=...
THOROUGHCARE_CLIENT_SECRET=...

# Mailchimp Integration
MAILCHIMP_API_KEY=...
MAILCHIMP_SERVER_PREFIX=...            # e.g., "us21"
MAILCHIMP_AUDIENCE_ID=...

# Optional
ALLOWED_ORIGINS=https://yourdomain.com # Comma-separated CORS origins
NODE_ENV=production                    # Must be "production" for HTTPS enforcement
```

**Generating encryption keys**:
```bash
# Generate PHI_ENCRYPTION_KEY (64 hex characters = 32 bytes)
openssl rand -hex 32

# Generate PHI_HMAC_KEY (64 hex characters = 32 bytes)
openssl rand -hex 32
```

---

## Deployment Checklist

Before going live with PHI, verify every item:

### Application
- [ ] All environment variables are set (see above)
- [ ] `NODE_ENV=production` is set
- [ ] PHI encryption keys are generated and stored securely
- [ ] Default admin password is changed on first login
- [ ] HTTPS is enforced (automatic in code when `NODE_ENV=production`)

### Hosting
- [ ] BAA is signed with hosting provider
- [ ] BAA is signed with database provider (Neon or alternative)
- [ ] TLS/SSL certificate is active and auto-renewed
- [ ] Infrastructure is not on shared/free-tier compute
- [ ] Server access is restricted to authorized personnel only

### Operations
- [ ] Backup strategy is documented and tested (encrypted backups)
- [ ] Incident response plan is in place
- [ ] Audit logs are reviewed periodically
- [ ] Password rotation reminders are configured
- [ ] Security patches are applied regularly
- [ ] Workforce training on HIPAA policies is completed

### Compliance Documentation
- [ ] Risk assessment is completed and documented
- [ ] HIPAA policies and procedures are written
- [ ] BAA copies are filed and accessible
- [ ] Breach notification procedures are established

---

## Data Flow & Architecture

```
                    ┌─────────────────┐
                    │   User Browser  │
                    │  (HTTPS only)   │
                    └────────┬────────┘
                             │ TLS 1.2+
                    ┌────────▼────────┐
                    │  Express.js App │
                    │  ┌────────────┐ │
                    │  │   Helmet   │ │  Security headers, CSP, HSTS
                    │  │ Rate Limit │ │  100 req/15min per IP
                    │  │   CORS     │ │  Origin validation
                    │  │ Cookie Auth│ │  httpOnly, Secure, SameSite
                    │  └────────────┘ │
                    │  ┌────────────┐ │
                    │  │   RBAC     │ │  viewer/admin/superadmin
                    │  │   Audit    │ │  All actions logged
                    │  │ Encryption │ │  AES-256-GCM per field
                    │  └────────────┘ │
                    └────────┬────────┘
                             │ TLS
                    ┌────────▼────────┐
                    │  PostgreSQL DB  │
                    │  (Neon - BAA)   │
                    │                 │
                    │  PHI: encrypted │
                    │  PII: encrypted │
                    │  Audit: append  │
                    └─────────────────┘
```

---

## Contact

For questions about this application's HIPAA implementation, reach out to the LynkHealth development team.

For HIPAA compliance program questions (BAAs, policies, risk assessments), consult your HIPAA Privacy Officer or compliance counsel.
