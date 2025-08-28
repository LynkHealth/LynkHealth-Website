# Lynk Health - Healthcare Care Coordination Platform

## Overview
Lynk Health is a comprehensive healthcare care coordination platform designed for Medicare patients with chronic conditions. It provides nurse-led services, including Chronic Care Management (CCM), Remote Patient Monitoring (RPM), and Behavioral Health Integration (BHI). The platform features a marketing website with contact functionality, detailed service information, and a revenue calculator for practices. Its ambition is to expand nationally, providing high-quality, local nurse-led care, emphasizing authentic connections and improved patient outcomes and aims to generate significant annual savings per patient while achieving high retention rates.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **Styling**: Tailwind CSS with shadcn/ui.
- **Build Tool**: Vite.
- **State Management**: TanStack Query.
- **Form Handling**: React Hook Form with Zod validation.
- **UI/UX Design**: Professional healthcare design using shadcn/ui, CSS custom properties with HSL color system, Inter font, and Font Awesome/Lucide React icons. Color scheme includes blue (primary), teal (secondary), and orange (accent).
- **Core Pages**: Home (with contact form integration), About (featuring leadership team, mission, and risk mitigation), Services (detailed pages for CCM, RPM, RTM, APCM, BHI), How It Works, Resources (blog posts and downloadable materials), and a Revenue Calculator.
- **Form Handling**: Client-side validation with Zod, real-time error messaging, toast notifications, and automatic form reset.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript (ES modules).
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon Database (serverless).
- **Session Management**: connect-pg-simple for PostgreSQL session storage.
- **API Design**: RESTful endpoints (`POST /api/contact` for submissions, `GET /api/contact-inquiries` for admin retrieval).
- **Database Schema**: Includes `Contact Inquiries` (name, email, phone, organization type, message) and `Users` (for future expansion). Drizzle Kit is used for migrations.

### Data Flow
User interaction on the website leads to client-side form validation, API communication with the Express.js backend, storage in PostgreSQL via Drizzle ORM, and toast notifications for user feedback.

### General Architectural Decisions
- Emphasis on robust validation and error handling across the application.
- Consolidated contact form into the home page for improved user experience.
- Implemented a centralized blog post management system for easy content updates.
- Integrated authentic industry statistics and Medicare billing codes for credibility.
- SEO strategy focuses on national reach, service quality, and relevant keywords.
- Leadership team information and professional imagery integrated into the About page.
- Testimonials replaced with white-label friendly marketing alternatives focusing on aggregate results and compliance (HIPAA, CMS, SOC 2).
- Enhanced local nurse messaging to differentiate from call centers and emphasize authentic connections.

## Recent Changes
- January 30, 2025: Updated color scheme throughout the site
  - Replaced orange accent color with healthcare-appropriate green (142 76% 36%)
  - Updated all color references including buttons, icons, and UI elements
  - Maintained professional blue primary and teal secondary colors
  - Fixed hover states and transitions to use new green accent color

## External Dependencies
- **Database**: `@neondatabase/serverless` (Neon Database), `drizzle-orm`.
- **Frontend State & Validation**: `@tanstack/react-query`, `@hookform/resolvers`, `zod`.
- **Routing**: `wouter`.
- **UI/Styling**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `class-variance-authority`, `shadcn/ui`.
- **Development Tools**: `vite`, `typescript`, `eslint`.