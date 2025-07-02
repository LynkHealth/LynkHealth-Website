# Lynk Health - Healthcare Care Coordination Platform

## Overview

Lynk Health is a comprehensive healthcare care coordination platform that provides nurse-led services for Medicare patients with chronic conditions. The application is built as a marketing website with contact form functionality, featuring information about Chronic Care Management (CCM), Remote Patient Monitoring (RPM), and Behavioral Health Integration (BHI) services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with Hot Module Replacement
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful endpoints with JSON responses

### UI/UX Design System
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Design Tokens**: CSS custom properties with HSL color system
- **Typography**: Inter font family
- **Icons**: Font Awesome and Lucide React
- **Theme**: Professional healthcare design with blue primary, teal secondary, and orange accent colors

## Key Components

### Database Schema
- **Contact Inquiries**: Stores form submissions with fields for name, email, phone, organization type, and message
- **Users**: Basic user authentication schema (for future expansion)
- **Migration System**: Drizzle Kit for database migrations

### API Routes
- `POST /api/contact`: Contact form submission endpoint with validation
- `GET /api/contact-inquiries`: Admin endpoint to retrieve contact submissions

### Core Pages
- **Home**: Hero section with services overview and testimonials
- **About**: Company mission, vision, and team information
- **Services**: Detailed pages for CCM, RPM/RTM, and BHI services
- **How It Works**: 3-step process explanation
- **Resources**: Blog posts and educational content
- **Contact**: Contact form with organization type selection
- **Calculator**: Revenue calculator for CCM and RPM programs

### Form Handling
- Contact form with comprehensive validation using Zod schemas
- Real-time form validation with error messaging
- Toast notifications for success/error states
- Automatic form reset on successful submission

## Data Flow

1. **User Interaction**: Users navigate the marketing website and fill out contact forms
2. **Form Validation**: Client-side validation using React Hook Form and Zod
3. **API Communication**: Form data sent to Express.js backend via fetch API
4. **Database Operations**: Contact inquiries stored in PostgreSQL via Drizzle ORM
5. **Response Handling**: Success/error responses displayed via toast notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router

### UI Libraries
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Fast build tool with HMR
- **typescript**: Static type checking
- **eslint**: Code linting and formatting
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Environment**: Production builds use NODE_ENV=production

### Database Setup
- Database URL required via DATABASE_URL environment variable
- Migrations handled via `drizzle-kit push` command
- Neon Database provides serverless PostgreSQL hosting

### Hosting Configuration
- Static files served from `dist/public` directory
- API routes prefixed with `/api`
- Single-page application routing handled by server fallback

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)

## Changelog

- July 02, 2025: Built comprehensive Resources section with actual content and downloadable materials
  - Created full-length blog posts with detailed healthcare content (CCM billing, RPM strategies)
  - Developed 4 professional downloadable resources with Lynk Health branding:
    * CCM Implementation Guide (24 pages) - Step-by-step program launch blueprint
    * RPM Device Selection Checklist (12 pages) - Technical requirements and vendor evaluation
    * BHI Best Practices Toolkit (32 pages) - Evidence-based behavioral health integration
    * Medicare Billing Compliance Guide (28 pages) - Complete CMS requirements reference
  - Added individual blog post pages with proper routing (/blog/:slug)
  - Implemented clickable blog posts linking to detailed articles with professional layout
  - Enhanced revenue calculator with sophisticated Medicare billing code calculations
  - All resources feature authentic Lynk Health branding and professional HTML formatting
- July 02, 2025: Integrated 14 professional Adobe Stock images throughout the website
  - Replaced all video elements and placeholders with high-quality healthcare photography
  - Strategic placement includes: hero sections, service showcases, about page, CCM/RPM/BHI pages
  - Added hover effects and professional image overlays for enhanced user engagement
  - Updated footer with transparent Lynk Health logo for brand consistency
  - Maintained authentic healthcare branding while improving visual appeal and loading speed
- July 02, 2025: Optimized website copy for SEO based on competitor analysis of AccuHealth, SignalLamp, ChartSpan, and CareHarmony
  - Updated hero messaging to focus on "Chronic Care Management & Remote Patient Monitoring That Actually Works"
  - Added specific revenue figures ($42+ CCM, $58+ RPM) based on Medicare reimbursement rates
  - Implemented "turnkey", "zero upfront costs", and "seamless EHR integration" messaging
  - Updated meta titles, descriptions, and keywords for better search engine optimization
  - Enhanced service page copy with competitor-proven terminology and value propositions
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.