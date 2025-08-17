# Vercel Deployment Guide (বাংলা)

## ১. GitHub এ আপলোড করুন

```bash
# Terminal/Command Prompt এ এই commands রান করুন:
git init
git add .
git commit -m "Initial commit - Tournament Platform"
git branch -M main

# আপনার GitHub repository URL দিন:
git remote add origin https://github.com/YOUR_USERNAME/tournament-platform.git
git push -u origin main
```

## ২. Vercel এ Deploy করুন

### Step 1: Vercel Account তৈরি করুন
- [vercel.com](https://vercel.com) এ যান
- "Sign up with GitHub" এ click করুন
- GitHub account দিয়ে login করুন

### Step 2: Database Setup করুন
- [neon.tech](https://neon.tech) এ free database তৈরি করুন
- অথবা [planetscale.com](https://planetscale.com) ব্যবহার করুন
- Database connection string copy করুন

### Step 3: Project Deploy করুন
- Vercel dashboard এ "New Project" click করুন
- আপনার GitHub repository select করুন
- "Import" এ click করুন

### Step 4: Environment Variables সেট করুন
Deploy করার সময় এই variables add করুন:

```
DATABASE_URL=postgresql://username:password@host:5432/database_name
JWT_SECRET=your-super-secure-random-string-here-minimum-32-characters
NODE_ENV=production
```

### Step 5: Deploy সম্পূর্ণ করুন
- "Deploy" button এ click করুন
- 2-3 মিনিট wait করুন
- আপনার website live হয়ে যাবে!

## ৩. Database Push করুন

Deploy হওয়ার পর terminal এ:
```bash
npm run db:push
```

## ৪. Admin Account
- Email: asiful2004@yahoo.com
- Password: 1234

## ৫. Final Check
- আপনার Vercel URL এ যান
- Login করে admin panel check করুন
- Tournament তৈরি করার try করুন

---

## Environment Variables Details:

### DATABASE_URL
```
# Neon থেকে পাবেন:
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb

# PlanetScale থেকে পাবেন:  
mysql://username:password@aws.connect.psdb.cloud/database-name?sslaccept=strict
```

### JWT_SECRET
```bash
# Random string generate করার জন্য:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Support
কোন সমস্যা হলে GitHub repository তে issue create করুন।