# Lynk Health - Healthcare Care Coordination Platform

## Overview
Lynk Health is a comprehensive healthcare care coordination platform for Medicare patients with chronic conditions. It offers nurse-led services such as Chronic Care Management (CCM), Remote Patient Monitoring (RPM), and Behavioral Health Integration (BHI). The platform includes a marketing website with contact functionality, service details, and a revenue calculator. The project aims for national expansion by providing high-quality, local nurse-led care to improve patient outcomes, generate significant annual savings per patient, and achieve high retention rates.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The platform features a professional healthcare design utilizing shadcn/ui, CSS custom properties with HSL color system, and strategic golden amber accents. The frontend is built with React 18, TypeScript, Wouter for routing, Tailwind CSS, Vite, TanStack Query for state management, and React Hook Form with Zod for form handling. The backend uses Node.js with Express.js and TypeScript, connecting to a PostgreSQL database on Neon Database managed with Drizzle ORM. Session management is handled by `connect-pg-simple`.

Key features include a consolidated contact form, a blog post management system, integration of industry statistics and Medicare billing codes, a leadership team section, and a "Who We Work With" section. The platform also offers an "Overnight On-Call Coverage" service.

An admin dashboard provides data aggregation from ThoroughCare API, including practice data, program enrollment snapshots, and inquiry management. It supports full and historical syncs of patient, enrollment, and time log data from ThoroughCare. The admin dashboard also manages CPT billing codes, allowing for inline editing, adding, and deleting codes, with support for different effective years and per-practice custom rates.

A clinical care coordination platform, accessible via `/clinical/*` routes, offers a comprehensive workflow for nurses and care managers. This includes a clinical dashboard, patient management with detailed patient charts, program-specific worklists, task management, scheduling, and care plan template management. It also features a persistent time tracking timer and user management with role-based access control (RBAC). The clinical data model comprises 16 interconnected tables. An AI-powered intake form scanner (`/clinical/scan-form`) uses OpenAI vision (via Replit AI Integrations) to read handwritten healthcare intake forms and extract patient information for review and patient profile creation.

Invoice management is integrated into the admin dashboard, enabling the generation and review of monthly practice invoices. Invoices use practice-specific billing rates and follow a status-based workflow. Staffing and FTE reports, derived from ThoroughCare time log data, are available in the admin dashboard, providing insights into staff hours, FTE calculations, and per-program breakdowns. ERA/EOB reconciliation allows for uploading and parsing 835 files to match CPT codes against billing rates and identify variances.

The system incorporates robust HIPAA compliance controls, including audit logging, a three-tier RBAC system, AES-256-GCM field-level encryption for PHI/PII, strong authentication policies (password complexity, expiry, lockout), secure session management (httpOnly/Secure/SameSite cookies, inactivity timeout), and transmission security (HTTPS, HSTS, helmet CSP, CORS, rate limiting). PHI-safe logging redacts sensitive data from response bodies.

The system design prioritizes robust validation, error handling, and SEO. A comprehensive cache management system ensures performance and content freshness through aggressive static asset caching, service workers, and build-time timestamp injection.

## External Dependencies
- **Database**: Neon Database (`@neondatabase/serverless`), `drizzle-orm`
- **Frontend State & Validation**: `TanStack Query` (`@tanstack/react-query`), `React Hook Form` (`@hookform/resolvers`), `zod`
- **Routing**: `wouter`
- **UI/Styling**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `class-variance-authority`, `shadcn/ui`
- **Development Tools**: `vite`, `typescript`, `eslint`