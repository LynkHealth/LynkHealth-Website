# Lynk Health - Healthcare Care Coordination Platform

## Overview
Lynk Health is a comprehensive healthcare care coordination platform for Medicare patients with chronic conditions, offering nurse-led services like Chronic Care Management (CCM), Remote Patient Monitoring (RPM), and Behavioral Health Integration (BHI). The platform includes a marketing website with contact functionality, detailed service information, and a revenue calculator. Its vision is national expansion, delivering high-quality, local nurse-led care that fosters authentic patient connections, improves outcomes, generates significant annual savings per patient, and achieves high retention rates.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### UI/UX Decisions
The platform features a professional healthcare design using shadcn/ui, CSS custom properties with HSL color system, Inter font, and Font Awesome/Lucide React icons. The color scheme primarily uses blue, teal, and a strategic golden amber accent for CTAs and key achievements. The design emphasizes clear navigation with core pages for services, an "About" section with leadership, and a revenue calculator.

### Technical Implementations
The frontend is built with React 18 and TypeScript, using Wouter for routing, Tailwind CSS with shadcn/ui for styling, Vite for building, TanStack Query for state management, and React Hook Form with Zod for form handling. Client-side validation with Zod provides real-time error messaging and toast notifications. The backend uses Node.js with Express.js and TypeScript (ES modules). It connects to a PostgreSQL database hosted on Neon Database, managed with Drizzle ORM. Session management is handled by `connect-pg-simple`.

### Feature Specifications
Key features include a consolidated contact form, a blog post management system, integration of authentic industry statistics and Medicare billing codes, and a leadership team section. Testimonials are replaced with compliance-friendly marketing focusing on aggregate results. The platform also includes a new "Who We Work With" section targeting various healthcare specialties and an "Overnight On-Call Coverage" service with dedicated pages and forms.

### Admin Dashboard & ThoroughCare Integration
A hidden admin dashboard is accessible via the copyright symbol (©) in the footer, leading to `/admin/login`. Admin credentials are stored in the database (`admin_users` table). The dashboard aggregates data from ThoroughCare API and displays:
- **Practice data**: Organizations with departments and aliases synced from ThoroughCare
- **Program snapshots**: CCM, PCM, BHI, RPM, RTM enrollment counts with time bucket breakdowns
- **Inquiry management**: Contact form submissions, night coverage inquiries, wound care referrals

**ThoroughCare API Integration** (`server/thoroughcare-client.ts`, `server/thoroughcare-sync.ts`):
- OAuth2 client credentials flow with token caching (credentials in Replit Secrets)
- Rate-limited API client (10 req/sec) with automatic pagination (1000 records/page)
- Full sync pulls: Organizations → Patients (build org map + department map) → Enrollments → Time Logs → Program Snapshots
- Patient API uses `managingOrganization=Organization/{id}` format to correctly map patients to practices
- Patient department extracted from extension `url: "department"` for location-level breakdowns
- Snapshots stored at both org-level (department=null) and department-level for multi-location practices
- Real-time sync progress tracking via `/api/admin/tc/status` polling
- Sync triggered via admin dashboard button or POST to `/api/admin/tc/sync`
- **Historical sync**: `runHistoricalSync()` via POST `/api/admin/tc/sync-historical` pulls 24 months of time log data in one operation (~4 min, ~130K time logs). Reuses org/patient/enrollment/CarePlan data once, then loops months for time logs + snapshots.
- Data volumes: ~7 practices, ~14,786 patients, ~3,578 enrollments, ~1,842 time logs/month
- Per-practice and per-department/location filtering available in admin dashboard via dual dropdown selectors
- Department dropdown appears only when a multi-location practice is selected (e.g., MEA with 9 locations, your clinic with 7)

### CPT Billing Codes Management
- Admin dashboard "Billing Codes" tab for managing Medicare fee schedule rates
- Database table `cpt_billing_codes` stores CPT codes with: code, description, program, rateCents, effectiveYear, state, isActive
- Pre-seeded with 29 Mississippi 2026 rates across CCM, RPM, BHI, PCM, RTM, APCM, AWV, TCM programs
- Inline editing: click pencil icon to edit rate/description, add new codes, delete codes
- Year selector allows managing rates for different years (update annually when new CMS schedules release)
- Revenue sync (`loadCptRatesFromDb`) loads rates from database filtered by effective year, with fallback to hardcoded rates
- Historical revenue sync caches rates per year for multi-year spans
- API routes: GET/POST/PUT/DELETE `/api/admin/billing-codes` (admin-auth protected)

### Clinical Care Coordination Platform
A clinical dashboard accessible at `/clinical/*` routes provides a full care coordination workflow for nurses and care managers:
- **Clinical Dashboard** (`/clinical/dashboard`): Landing page showing welcome header, stats cards (active patients, enrollments, pending tasks, minutes this month), task queue, and upcoming schedule for the next 7 days.
- **Patient Management** (`/clinical/patients`): Searchable, paginated patient list with create/edit. Links to individual patient charts.
- **Patient Chart** (`/clinical/patients/:id`): 9-tabbed interface (Overview, Conditions, Medications, Allergies, Vitals, Insurance, Enrollments, Care Plans, Time Logs). Each tab supports CRUD operations.
- **Program Worklists** (`/clinical/worklists`): Filter enrolled patients by program type (CCM, PCM, BHI, RPM, RTM, TCM, APCM, AWV), status, and search. Shows minutes tracked and risk levels.
- **Task Management** (`/clinical/tasks`): Full CRUD for clinical tasks with priority/status filters, search, create/edit dialog. Tasks have priority (high/normal/low), status (pending/in_progress/completed), due dates, and optional patient linking.
- **Schedule/Calendar** (`/clinical/schedule`): Week-view calendar showing patient calls and events. Events color-coded by type (call, follow_up, assessment, appointment). Create/edit events with date/time, type, patient linking, notes.
- **Care Plan Templates** (`/clinical/templates`): Manage reusable care plan templates by program type (CCM, PCM, BHI, RPM, RTM, etc.). Templates contain items (goals, interventions, outcomes). Apply templates to create care plans for patients. Admin/supervisor only for management.
- **Time Tracking Timer**: Persistent floating widget (bottom-right) for timing patient calls. Start/pause/stop with program type and activity type selection. Auto-logs to time_logs table on stop. Timer state persists in localStorage across page navigation.
- **User Management** (`/clinical/users`): Create/edit users with roles (admin, supervisor, care_manager, provider). Role-based access control. Admin/supervisor only.
- **Analytics & Trends** (admin dashboard "Analytics" tab): Revenue trend charts, enrollment trend lines, claims volume bars. 3/6/12 month period selectors. CSV export for revenue and enrollment data.
- **Clinical Data Model**: 16 tables (patients, conditions, medications, allergies, vitals, insurance, program_enrollments, care_plans, care_plan_items, care_plan_templates, care_plan_template_items, time_logs, clinical_tasks, assessments, calendar_events, claims)
- **API Routes**: All under `/api/clinical/*` with adminAuth middleware. Full CRUD for patients and sub-entities. Dashboard aggregation endpoints under `/api/clinical/dashboard/*`.
- **Shared Auth**: Clinical users share the `admin_users` table with role field differentiation.
- **Role-Based Access Control**: `requireRole()` middleware enforces permissions on API routes. Frontend navigation hides items based on user role. User management and template management restricted to admin/supervisor roles.

### Invoice Management
- Admin dashboard "Invoices" tab for generating and reviewing monthly practice invoices
- Database tables: `invoices` (invoice header with practice, month, year, totals, status), `invoice_line_items` (CPT code breakdown per invoice), and `invoice_rates` (per-practice custom billing rates)
- **Per-practice billing rates**: Each practice has its own set of invoice rates (stored in `invoice_rates` with `practice_id` column). Rates are initialized from billing codes on first access and can be customized per practice. Managed in the Practices tab by clicking a practice to open its detail view.
- Invoice generation uses practice-specific rates with fallback to billing codes when no custom rates exist
- Generation is idempotent — won't create duplicate invoices for the same practice/month. All practices (excluding Lynk Demo) get invoices, even those with $0/0 claims.
- Status workflow: `pending_review` → `approved` → `sent` → `paid` (or `rejected` from pending_review)
- Invoice numbers follow format: `INV-{practiceId}-{year}-{month}`
- API routes: POST `/api/admin/invoices/generate`, GET `/api/admin/invoices`, GET `/api/admin/invoices/:id`, PUT `/api/admin/invoices/:id/status`, DELETE `/api/admin/invoices/:id`, GET `/api/admin/invoice-rates/:practiceId/:year`, PUT `/api/admin/invoice-rates`
- Admin/supervisor users can review, approve, reject, mark sent, mark paid
- **Practice Detail View**: Practices tab rows are clickable, opening a detail view showing practice info (name, alias, departments, status) and a billing rates table scoped to that practice with inline editing

### Staffing & FTE Reports
- Admin dashboard "Staffing" tab for viewing staff hours and FTE calculations from ThoroughCare time log data
- Database table `tc_staff_time_logs` stores per-task time entries with: tcTaskId, practiceId, department, patientTcId, programType, staffTcId, staffName, staffRole, minutes, logDate, month, year
- Data populated during ThoroughCare sync by extracting `owner` field from FHIR Task resources (practitioner/staff identity)
- Staff role inferred from owner qualifications or name patterns (Nurse, LPN, Medical Assistant, Enrollment Specialist, Care Coordinator)
- Report shows: summary cards (total staff, hours, FTEs, encounters), hours-by-role bar chart with FTE breakdown, detailed staff table with per-program hour breakdown
- FTE calculation: hours / 160 (standard monthly FTE)
- Filterable by month/year and practice; CSV export available
- API route: GET `/api/admin/staffing?month=&year=&practiceId=` (admin-auth protected)
- Data refreshes each sync — old month data is cleared and replaced with fresh data

### System Design Choices
The architecture emphasizes robust validation and error handling. SEO strategy focuses on national reach and service quality. A comprehensive cache management system ensures users always see the latest content after deployments while optimizing performance through aggressive caching of static assets, using a service worker and build-time timestamp injection. HTTP cache headers are carefully configured for various asset types to balance freshness and performance.

## Production Deployment - CRITICAL

**Cache Management Build Process:**
The standard `npm run build` does NOT run the required cache timestamp injection. For production deployments, you MUST use:

```bash
./build.sh
```

Or configure your Replit deployment to use `./build.sh` as the build command.

**Why this matters:**
- The service worker (`sw.js`) is generated from a template at build time
- Without running the injection script, users won't see updates after deployments
- The build script ensures unique cache versions per deployment

**Files involved:**
- `client/public/sw.template.js` - Service worker template
- `scripts/inject-build-timestamp.js` - Build-time injection script
- `build.sh` - Production build wrapper (use this!)

## External Dependencies
- **Database**: `@neondatabase/serverless` (Neon Database), `drizzle-orm`.
- **Frontend State & Validation**: `@tanstack/react-query`, `@hookform/resolvers`, `zod`.
- **Routing**: `wouter`.
- **UI/Styling**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `class-variance-authority`, `shadcn/ui`.
- **Development Tools**: `vite`, `typescript`, `eslint`.