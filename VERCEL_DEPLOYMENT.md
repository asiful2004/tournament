# Vercel এ Deploy করার সম্পূর্ণ গাইড

## ধাপ ১: GitHub Repository তৈরি করুন

1. GitHub এ যান এবং নতুন repository তৈরি করুন
2. Repository নাম দিন: `free-fire-tournament-platform`
3. Public বা Private যেটা চান সেট করুন
4. README.md ছাড়া খালি repository তৈরি করুন

## ধাপ ২: আপনার Code GitHub এ Push করুন

আপনার project folder এ terminal খুলে এই commands গুলো run করুন:

```bash
# Git initialize করুন
git init

# সব file add করুন
git add .

# First commit করুন
git commit -m "Free Fire Tournament Platform - Initial commit"

# Main branch set করুন
git branch -M main

# GitHub repository connect করুন (আপনার username দিয়ে replace করুন)
git remote add origin https://github.com/YOUR_USERNAME/free-fire-tournament-platform.git

# Code push করুন
git push -u origin main
```

## ধাপ ৩: Database Setup (Neon বা অন্য PostgreSQL)

### Neon Database (Recommended - Free):
1. [neon.tech](https://neon.tech) এ যান
2. GitHub দিয়ে signup করুন
3. নতুন project তৈরি করুন
4. Database connection string copy করুন (এটা দেখতে এরকম: `postgresql://user:pass@host/database`)

### Alternative - PlanetScale বা Supabase:
- [PlanetScale](https://planetscale.com) - MySQL compatible
- [Supabase](https://supabase.com) - PostgreSQL with extra features

## ধাপ ৪: Vercel এ Deploy করুন

1. [vercel.com](https://vercel.com) এ যান
2. "Sign up with GitHub" click করুন
3. "New Project" click করুন
4. আপনার `free-fire-tournament-platform` repository select করুন
5. "Import" click করুন

### Environment Variables Setup:
Vercel deploy করার সময় এই environment variables add করুন:

```
DATABASE_URL=postgresql://your-database-connection-string
JWT_SECRET=your-super-secure-random-string-here
NODE_ENV=production
PGHOST=your-db-host
PGPORT=5432
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGDATABASE=your-db-name
```

**Important Notes:**
- `JWT_SECRET` এর জন্য minimum 32 characters এর random string use করুন
- সব credentials secure রাখুন
- Database URL exactly copy করুন

## ধাপ ৫: Build Settings

Vercel automatic detect করবে, কিন্তু manually set করতে চাইলে:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## ধাপ ৬: Deploy করুন

1. "Deploy" button click করুন
2. Build process দেখুন (2-3 মিনিট লাগবে)
3. Success হলে আপনার live URL পাবেন

## ধাপ ৭: Database Tables Create করুন

Deploy সফল হওয়ার পর:

1. Vercel dashboard থেকে আপনার project এ যান
2. "Functions" tab এ যান
3. Terminal বা local এ database push করুন:
   ```bash
   npx drizzle-kit push
   ```

## ধাপ ৮: Admin Account Setup

Application প্রথমবার load হলে automatic admin account তৈরি হবে:
- **Email**: asiful2004@yahoo.com
- **Password**: 1234

## Troubleshooting

### Common Issues:

1. **Build Failed**: 
   - Environment variables check করুন
   - Database connection string verify করুন

2. **Database Connection Error**:
   - DATABASE_URL সঠিক আছে কিনা check করুন
   - Database accessible কিনা verify করুন

3. **Functions Timeout**:
   - Database queries optimize করুন
   - Connection pooling enable করুন

### Support Commands:

```bash
# Database schema update
npm run db:push

# Local development
npm run dev

# Production build test
npm run build
npm start
```

## Auto-Deploy Setup

GitHub এ কোন change করলেই automatic Vercel এ deploy হবে:

1. Code change করুন
2. Git commit & push করুন
3. Vercel automatically নতুন version deploy করবে

## Custom Domain (Optional)

1. Vercel dashboard এ "Domains" tab
2. আপনার domain add করুন
3. DNS settings configure করুন

## Security Notes

- Environment variables কখনো code এ commit করবেন না
- Regular backup নিন
- Strong passwords use করুন
- HTTPS always enabled থাকবে Vercel এ

আপনার tournament platform এখন live! 🎮