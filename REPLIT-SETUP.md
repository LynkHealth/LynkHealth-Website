# LynkHealth — Replit Development Setup Guide

> **Purpose**: Use Replit for development and testing. Deploy to **Railway** (with BAA) for HIPAA-compliant production hosting.
>
> **Do NOT handle real patient data on Replit.** Use test/dummy data only during development.

---

## Environment Variables (Secrets)

Go to **Replit > Tools > Secrets** (or the lock icon in the sidebar) and add each variable below.

### 1. Database

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `DATABASE_URL` | `postgresql://...` | Replit PostgreSQL (built-in) or [Neon](https://neon.tech) free tier. Copy the connection string. |

**Replit built-in**: If using Replit's PostgreSQL, it auto-sets `DATABASE_URL`.

**Neon (recommended)**: Create a free project at [neon.tech](https://neon.tech), copy the connection string from the dashboard.

### 2. Admin Account

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `ADMIN_DEFAULT_PASSWORD` | A strong password (12+ chars, upper/lower/number/special) | You create this. Used for initial admin accounts. **Change on first login.** |

Example: `Lynk$ecure2026!Dev`

### 3. PHI Encryption Keys (HIPAA)

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `PHI_ENCRYPTION_KEY` | 64 hex characters | Generate (see below) |
| `PHI_ENCRYPTION_KEY_ID` | `v1` | Just use `v1` to start |
| `PHI_HMAC_KEY` | 64 hex characters | Generate (see below) |

**Generate keys** — Run this in the Replit Shell:

```bash
# Generate PHI_ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PHI_HMAC_KEY (run again for a different key)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy each output and paste it as the secret value.

### 4. ThoroughCare API

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `THOROUGHCARE_CLIENT_ID` | Your ThoroughCare OAuth client ID | From ThoroughCare admin portal or your ThoroughCare contact |
| `THOROUGHCARE_CLIENT_SECRET` | Your ThoroughCare OAuth client secret | Same as above |

> If you don't have ThoroughCare credentials yet, the app will still run — the sync feature just won't work.

### 5. Mailchimp

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `MAILCHIMP_API_KEY` | `xxxxxxxx-us21` | [Mailchimp](https://mailchimp.com) > Account > Extras > API Keys > Create Key |
| `MAILCHIMP_SERVER_PREFIX` | `us21` (or your prefix) | The part after the dash in your API key (e.g., `us21`) |
| `MAILCHIMP_AUDIENCE_ID` | `abc123def4` | Mailchimp > Audience > Settings > Audience name and defaults > Audience ID |

> If you don't have Mailchimp credentials yet, the app still runs — form submissions just won't sync to Mailchimp.

### 6. Ambient AI (Optional — for call transcription & SOAP notes)

| Variable | Value | How to Get It |
|----------|-------|---------------|
| `DEEPGRAM_API_KEY` | `dg_xxxxxxxx` | [Deepgram](https://deepgram.com) > Dashboard > API Keys > Create Key. Free tier includes $200 credit. |
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxx` | [Anthropic Console](https://console.anthropic.com) > API Keys > Create Key |

**Without these keys**:
- Transcription falls back to **manual text entry** (paste/type the transcript)
- SOAP notes fall back to **blank template** (fill in manually)
- The app is fully functional either way — AI just speeds up the workflow

---

## Quick Start on Replit

### Step 1: Set Up Secrets
Add all the environment variables above in **Replit > Tools > Secrets**.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Push Database Schema
```bash
npm run db:push
```
This creates all tables (including the new `call_sessions`, `transcripts`, `soap_notes`, `time_entries` tables).

### Step 4: Run the App
```bash
npm run dev
```
The app starts on port 5000. Replit will show the webview automatically.

### Step 5: Log In
- Go to `/admin/login`
- Use one of the seeded admin accounts:
  - `alexander.barrett@lynkhealthcare.com` (superadmin)
  - `will.moon@lynkhealthcare.com` (admin)
- Password: whatever you set as `ADMIN_DEFAULT_PASSWORD`
- You'll be prompted to change the password on first login

---

## Ambient AI Setup (Deepgram + Anthropic)

### Getting a Deepgram API Key

1. Sign up at [deepgram.com](https://deepgram.com) (free $200 credit)
2. Go to **Dashboard > API Keys**
3. Click **Create API Key**
4. Name: `lynkhealth-dev`, Permissions: **Member**
5. Copy the key and add it as `DEEPGRAM_API_KEY` in Replit Secrets

**Cost**: ~$0.006/second of audio (~$0.36/minute). The $200 free credit covers ~550 hours of transcription.

### Getting an Anthropic API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys > Create Key**
3. Name: `lynkhealth-dev`
4. Copy the key and add it as `ANTHROPIC_API_KEY` in Replit Secrets

**Cost**: ~$0.05-$0.10 per SOAP note generation (using Claude Sonnet).

### Testing the Ambient AI

1. Log in to the admin panel
2. Click **"Call Recordings"** in the sidebar
3. Click **"New Call"** > fill in patient reference and program
4. Click **"Start Call Session"** > **"Start Recording"**
5. Speak for 10-20 seconds (test audio)
6. Click **"Stop"** > **"Submit Recording"**
7. The system will automatically transcribe and generate a SOAP note
8. Review the SOAP note, edit if needed, then click **"Sign"**

---

## Moving to Railway (Production)

When you're ready for production with real patient data:

### Step 1: Create a Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up for a **Teams plan** (required for BAA)
3. Request a **Business Associate Agreement (BAA)** from Railway support

### Step 2: Deploy from GitHub
1. Push your code to GitHub (it's already on the `claude/security-audit-RQPXS` branch)
2. In Railway, click **New Project > Deploy from GitHub Repo**
3. Select the LynkHealth-Website repository

### Step 3: Add Environment Variables
Add all the same secrets from above in Railway's **Variables** tab. For production, also set:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://yourdomain.com` |

### Step 4: Add a PostgreSQL Database
1. In Railway, click **New > Database > PostgreSQL**
2. Railway auto-sets `DATABASE_URL`
3. Run `npm run db:push` via Railway's CLI or deploy hook

### Step 5: Custom Domain + SSL
1. In Railway, go to **Settings > Networking > Custom Domain**
2. Add your domain (e.g., `app.lynkhealthcare.com`)
3. Railway provides free SSL certificates automatically

### Step 6: Verify HIPAA Checklist
- [ ] BAA signed with Railway
- [ ] BAA signed with database provider (Neon or Railway PostgreSQL)
- [ ] BAA signed with Deepgram (if using automatic transcription)
- [ ] BAA requested from Anthropic (if using AI SOAP generation)
- [ ] `NODE_ENV=production` set (enables HTTPS enforcement, secure cookies)
- [ ] `ALLOWED_ORIGINS` set to production domain only
- [ ] Default admin passwords changed
- [ ] PHI encryption keys securely stored (not in code)

---

## All Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_DEFAULT_PASSWORD` | Yes | Initial admin account password |
| `PHI_ENCRYPTION_KEY` | Yes | 64-char hex AES-256 encryption key |
| `PHI_ENCRYPTION_KEY_ID` | Yes | Key version ID (start with `v1`) |
| `PHI_HMAC_KEY` | Yes | 64-char hex HMAC key for searchable encryption |
| `THOROUGHCARE_CLIENT_ID` | For sync | ThoroughCare OAuth client ID |
| `THOROUGHCARE_CLIENT_SECRET` | For sync | ThoroughCare OAuth client secret |
| `MAILCHIMP_API_KEY` | For email | Mailchimp API key |
| `MAILCHIMP_SERVER_PREFIX` | For email | Mailchimp server prefix (e.g., `us21`) |
| `MAILCHIMP_AUDIENCE_ID` | For email | Mailchimp audience/list ID |
| `DEEPGRAM_API_KEY` | For AI transcription | Deepgram Nova-2 Medical API key |
| `ANTHROPIC_API_KEY` | For AI SOAP notes | Anthropic Claude API key |
| `NODE_ENV` | Production | Set to `production` for HTTPS, secure cookies |
| `ALLOWED_ORIGINS` | Production | Comma-separated allowed CORS origins |
