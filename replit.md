# Free Fire Tournament Platform

## Overview

This is a full-stack web application for hosting Free Fire gaming tournaments with real-money betting and automated tournament management. The platform features user registration with age verification (15+ only), tournament creation and management, manual payment processing via Bangladeshi mobile banking (bKash/Nagad), automated email reminders, and a marketplace for selling the website source code. The application emphasizes a strict no-refund policy and implements comprehensive user role management with admin capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with custom gaming theme (dark purple/black color scheme)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session-based authentication
- **File Uploads**: Multer middleware for handling tournament banner uploads
- **Email Service**: Nodemailer for automated tournament reminders

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle migrations with PostgreSQL dialect
- **Key Tables**:
  - `users`: User profiles with role-based permissions (user/admin/super_admin)
  - `tournaments`: Tournament details with status tracking and game modes
  - `payments`: Manual payment processing with approval workflow
  - `participants`: Tournament participation tracking
  - `website_orders`: Marketplace orders for source code sales
  - `sessions`: Replit Auth session storage (mandatory)

### Authentication & Authorization
- **Provider**: Replit OpenID Connect (OIDC) integration
- **Session Management**: PostgreSQL-backed session store with 1-week TTL
- **Age Verification**: Mandatory 15+ age verification with date validation
- **Role System**: Three-tier permissions (user, admin, super_admin)
- **Security**: CSRF protection, secure session cookies, input validation

### Payment Processing
- **Method**: Manual payment verification (no automated payment gateways)
- **Supported Providers**: bKash and Nagad (Bangladeshi mobile banking)
- **Workflow**: User submits payment proof → Admin approval → Tournament access
- **Policy**: Strict no-refund policy enforced across all transactions

### Tournament Management
- **Game Modes**: Solo and Squad competitions
- **Status Lifecycle**: Draft → Published → Live → Finished/Cancelled
- **Automated Reminders**: Email notifications at 30, 20, and 5 minutes before start
- **Secret Information**: Room details revealed 5 minutes before tournament start
- **Real-time Features**: Countdown timers and status updates

### Email Automation
- **Service**: SMTP-based email delivery via Nodemailer
- **Templates**: Rich HTML templates with gaming theme
- **Scheduling**: Cron-based reminder system
- **Content**: Dynamic tournament information and secret room details

### File Management
- **Upload Handler**: Multer with disk storage
- **File Types**: Image uploads for tournament banners (5MB limit)
- **Storage**: Local filesystem with static serving via Express
- **Security**: File type validation and size restrictions

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth OIDC provider
- **Email Delivery**: SMTP service (Gmail or custom SMTP server)
- **Session Storage**: PostgreSQL via connect-pg-simple

### Third-party Libraries
- **UI Framework**: Radix UI component primitives
- **Styling**: Tailwind CSS framework
- **Data Fetching**: TanStack Query for API state management
- **Form Handling**: React Hook Form with Hookform resolvers
- **Validation**: Zod schema validation library
- **Date Handling**: date-fns for timestamp manipulation
- **Email Service**: Nodemailer for SMTP email delivery

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: TypeScript across frontend and backend
- **Code Bundling**: ESBuild for production server bundling
- **Development Environment**: tsx for TypeScript execution in development

### Payment Integration
- **Mobile Banking**: bKash and Nagad (manual verification process)
- **Transaction Tracking**: Custom payment verification system
- **No Automated Gateways**: All payments processed manually through admin interface