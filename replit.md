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