# Free Fire Tournament Platform

A full-stack web application for hosting Free Fire gaming tournaments with real-money betting and automated tournament management.

## Features

- User registration with age verification (15+ only)
- Tournament creation and management
- Manual payment processing via Bangladeshi mobile banking (bKash/Nagad)
- Automated email reminders
- Admin panel for tournament and payment management
- Marketplace for selling website source code

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication
- **UI Components**: Radix UI + shadcn/ui

## Deployment on Vercel

### Prerequisites

1. GitHub account
2. Vercel account (sign up with GitHub)
3. PostgreSQL database (Neon, PlanetScale, or similar)

### Steps to Deploy

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/tournament-platform.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure random string
     - `NODE_ENV`: production

3. **Database Setup**:
   ```bash
   npm run db:push
   ```

4. **Deploy**: 
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production
```

## Default Admin Account

- Email: asiful2004@yahoo.com
- Password: 1234

## Local Development

```bash
npm install
npm run db:push
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Express backend
│   ├── auth.ts          # Authentication middleware
│   ├── newRoutes.ts     # API routes
│   ├── storage.ts       # Database operations
│   └── emailService.ts  # Email functionality
├── shared/              # Shared types and schemas
└── uploads/             # File upload directory
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Age verification (15+ only)
- Input validation and sanitization
- Secure cookie handling
- HTTPS enforcement in production

## Support

For issues or questions, please contact the development team or create an issue on GitHub.