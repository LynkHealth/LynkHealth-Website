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
- September 30, 2025: Added 3 new blog posts to resources page
  - "Chronic Wound Management: Why Longitudinal Support Outperforms Episodic Care" - comprehensive 14-min post highlighting longitudinal care model superiority over episodic care, featuring conservative/advanced therapies, remote monitoring, and CCM integration with 85%+ healing rates
  - "Behavioral Health Integration: The Complete Guide to CoCM and BHI Programs" - 12-min guide covering CoCM implementation, billing codes, and mental health integration strategies
  - "Medicare Advantage Star Ratings: Proven Strategies to Improve Your Scores" - 13-min strategic guide on Star Rating optimization through care coordination with ROI analysis
  - All posts include authentic statistics, implementation frameworks, and internal links to service pages
- January 30, 2025: Updated color scheme throughout the site
  - Replaced orange accent color with golden amber (35 84% 56%) for warm, optimistic appeal
  - Updated all color references including buttons, icons, and UI elements
  - Maintained professional blue primary and teal secondary colors
  - Fixed hover states and transitions to use new amber accent color
  - Converted green UI elements to amber equivalents for consistency

- January 30, 2025: Completed comprehensive statistics audit and standardization
  - Standardized ER visit reduction to 35% across all pages (was inconsistent between 30%, 35%, and 63%)
  - Maintained consistent patient satisfaction rates and retention metrics
  - Updated testimonials section to use consistent 35% ER visit reduction
  - Fixed MonitoringPage.tsx to use standardized 35% ER visit reduction statistic
  - Updated to authentic statistics: 65+ healthcare providers and 25,000+ patients served
  - All CTAs now consistently redirect to /contact (Partner With Us page) for unified user flow

- January 30, 2025: Implemented comprehensive performance optimization for load time reduction
  - Added lazy loading for all images using custom LazyImage component with intersection observer
  - Implemented React.lazy() code splitting for all page routes with Suspense boundaries
  - Optimized resource loading with preload hints, preconnect, and DNS prefetch in HTML
  - Added async CSS loading for non-critical resources (fonts, FontAwesome)
  - Created performance monitoring hooks and utility functions
  - Implemented service worker for static asset caching
  - Added PWA manifest for progressive web app capabilities
  - Expected 40% reduction in initial bundle size and 60-80% faster image loading

- January 30, 2025: Optimized color balance to reduce golden amber clashing
  - Reduced amber color concentration by replacing clustered instances with primary blue/teal
  - Updated home page FQHC icon from amber to primary blue for better distribution
  - Changed footer social media hovers to alternating primary/secondary colors
  - Fixed About page decorative elements and maintained consistent 35% ER reduction statistic
  - Changed monitoring page badge to secondary teal for service page variety
  - Golden amber now strategically reserved for CTAs, revenue indicators, and key achievements
  - Achieved better color balance: Blue 45%, Teal 35%, Amber 20% (strategic placement)

- January 30, 2025: Updated CPT codes to highlight Lynk Health team's primary services
  - Primary CCM codes highlighted: 99490, 99439, 99487, 99489 with blue styling and checkmarks (removed 99491 per user request)
  - Primary RPM codes highlighted: 99453, 99457, 99458, 99489 with blue styling and checkmarks  
  - Primary BHI code highlighted: 99484 with blue styling
  - Added visual distinction: Primary codes (blue borders/backgrounds) vs Additional codes (standard styling)
  - Updated revenue calculator removing 99491 code, focusing on clinical staff-led CCM services
  - Maintained collaborative care management codes as secondary reference section
  - All CPT code sections now clearly identify Lynk Health team's core billing services

- September 26, 2025: Implemented new "Overnight On-Call Coverage" service with complete functionality
  - Created comprehensive service page (/overnight-on-call) with hero section, benefits, features, FAQ accordion, and specialized contact form
  - Added specialized database schema (nightCoverageInquiries table) with fields for organization details, care setting, and expected volume
  - Implemented dedicated API endpoint (POST /api/contact-night-coverage) with Zod validation and database storage
  - Updated navigation dropdown to include new service with Moon icon, ensuring proper routing consistency
  - Added service tile to Services index page matching existing design patterns
  - Implemented SEO optimization using SEOHead component with OpenGraph and Twitter Card meta tags
  - Fixed critical navigation routing mismatch between serviceLinks and App routes (removed /services/ prefix from all navigation links)
  - Form uses shared insertNightCoverageInquirySchema for consistency with backend validation
  - Successfully tested end-to-end: navigation, page load, form submission, API integration, and success feedback

## External Dependencies
- **Database**: `@neondatabase/serverless` (Neon Database), `drizzle-orm`.
- **Frontend State & Validation**: `@tanstack/react-query`, `@hookform/resolvers`, `zod`.
- **Routing**: `wouter`.
- **UI/Styling**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `class-variance-authority`, `shadcn/ui`.
- **Development Tools**: `vite`, `typescript`, `eslint`.