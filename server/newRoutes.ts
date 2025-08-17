import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, requireAdmin, hashPassword, comparePassword, generateToken, generatePasswordResetToken, resetPassword, sendPasswordResetEmail, type AuthRequest } from "./auth";
import { insertTournamentSchema, insertPaymentSchema, insertParticipantSchema, insertWebsiteOrderSchema } from "@shared/schema";
import { emailService } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import cookieParser from "cookie-parser";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware setup
  app.use(cookieParser());
  
  // Static file serving for uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, confirmPassword, dateOfBirth, acceptedTerms, acceptedPrivacy } = req.body;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      if (!acceptedTerms || !acceptedPrivacy) {
        return res.status(400).json({ message: 'You must accept the Terms & Conditions and Privacy Policy' });
      }

      // Age verification
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 15) {
        return res.status(400).json({ message: 'Must be 15 years or older to register' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        dateOfBirth: birthDate,
        isAgeVerified: true,
        acceptedTerms,
        acceptedPrivacy,
        emailVerified: true, // Auto-verify for now
      });

      await storage.createAuditLog(user.id, 'user_registered', { email });

      // Generate token
      const token = generateToken(user.id, user.email, user.role || 'user');
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ 
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      await storage.createAuditLog(user.id, 'user_login', { email });

      // Generate token
      const token = generateToken(user.id, user.email, user.role || 'user');
      
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge,
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAgeVerified: user.isAgeVerified,
        emailVerified: user.emailVerified,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Forgot password routes
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const token = await generatePasswordResetToken(email);
      if (token) {
        await sendPasswordResetEmail(email, token);
      }

      // Always return success to prevent email enumeration
      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process password reset request' });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      const success = await resetPassword(token, password);
      if (!success) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  });

  // Tournament routes (public read access)
  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ message: 'Failed to fetch tournaments' });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: 'Tournament not found' });
      }
      res.json(tournament);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      res.status(500).json({ message: 'Failed to fetch tournament' });
    }
  });

  // Protected tournament routes
  app.post('/api/tournaments', isAuthenticated, requireAdmin, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]), async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoUrl = files.logo ? `/uploads/${files.logo[0].filename}` : undefined;
      const bannerUrl = files.banner ? `/uploads/${files.banner[0].filename}` : undefined;

      const tournamentData = {
        ...req.body,
        logoUrl,
        bannerUrl,
        createdBy: req.user.id,
        entryFee: parseFloat(req.body.entryFee),
        prize1: req.body.prize1 ? parseFloat(req.body.prize1) : undefined,
        prize2: req.body.prize2 ? parseFloat(req.body.prize2) : undefined,
        prize3: req.body.prize3 ? parseFloat(req.body.prize3) : undefined,
        maxParticipants: req.body.maxParticipants ? parseInt(req.body.maxParticipants) : undefined,
        startTime: new Date(req.body.startTime),
      };

      const validatedData = insertTournamentSchema.parse(tournamentData);
      const tournament = await storage.createTournament(validatedData);
      
      await storage.createAuditLog(req.user.id, 'tournament_created', { tournamentId: tournament.id });
      
      res.json(tournament);
    } catch (error) {
      console.error('Error creating tournament:', error);
      res.status(500).json({ message: 'Failed to create tournament' });
    }
  });

  // Admin panel routes
  app.get('/api/admin/users', isAuthenticated, requireAdmin, async (req: AuthRequest, res) => {
    try {
      // Implementation would go here - get all users
      res.json({ message: 'Admin users endpoint' });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Settings routes
  app.get('/api/admin/settings', isAuthenticated, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });

  app.post('/api/admin/settings', isAuthenticated, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.setSetting(key, value);
      
      if (req.user) {
        await storage.createAuditLog(req.user.id, 'setting_updated', { key, value });
      }
      
      res.json(setting);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({ message: 'Failed to update setting' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}