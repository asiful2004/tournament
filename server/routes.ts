import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTournamentSchema, insertPaymentSchema, insertParticipantSchema, insertWebsiteOrderSchema } from "@shared/schema";
import { emailService } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

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
  // Auth middleware
  await setupAuth(app);

  // Static file serving for uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Age verification
  app.post('/api/auth/verify-age', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { dateOfBirth } = req.body;
      
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 15) {
        return res.status(400).json({ message: "Must be 15 years or older to participate" });
      }
      
      await storage.updateUser(userId, {
        dateOfBirth: birthDate,
        isAgeVerified: true,
      });
      
      await storage.createAuditLog(userId, 'age_verified', { age });
      
      res.json({ message: "Age verified successfully" });
    } catch (error) {
      console.error("Error verifying age:", error);
      res.status(500).json({ message: "Failed to verify age" });
    }
  });

  // Tournament routes
  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post('/api/tournaments', isAuthenticated, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoUrl = files.logo ? `/uploads/${files.logo[0].filename}` : undefined;
      const bannerUrl = files.banner ? `/uploads/${files.banner[0].filename}` : undefined;

      const tournamentData = {
        ...req.body,
        logoUrl,
        bannerUrl,
        createdBy: userId,
        entryFee: parseFloat(req.body.entryFee),
        prize1: req.body.prize1 ? parseFloat(req.body.prize1) : undefined,
        prize2: req.body.prize2 ? parseFloat(req.body.prize2) : undefined,
        prize3: req.body.prize3 ? parseFloat(req.body.prize3) : undefined,
        maxParticipants: req.body.maxParticipants ? parseInt(req.body.maxParticipants) : undefined,
        startTime: new Date(req.body.startTime),
      };

      const validatedData = insertTournamentSchema.parse(tournamentData);
      const tournament = await storage.createTournament(validatedData);
      
      await storage.createAuditLog(userId, 'tournament_created', { tournamentId: tournament.id });
      
      res.json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  // Join tournament
  app.post('/api/tournaments/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournamentId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user?.isAgeVerified) {
        return res.status(400).json({ message: "Age verification required" });
      }

      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      const participant = await storage.createParticipant({
        userId,
        tournamentId,
        status: 'pending_payment',
      });

      await storage.createAuditLog(userId, 'tournament_joined', { tournamentId, participantId: participant.id });
      
      res.json(participant);
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  // Payment routes
  app.post('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentData = {
        ...req.body,
        userId,
        amount: parseFloat(req.body.amount),
      };

      const validatedData = insertPaymentSchema.parse(paymentData);
      const payment = await storage.createPayment(validatedData);
      
      await storage.createAuditLog(userId, 'payment_submitted', { paymentId: payment.id });
      
      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to submit payment" });
    }
  });

  app.get('/api/payments/pending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const payments = await storage.getPaymentsByStatus('pending');
      res.json(payments);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      res.status(500).json({ message: "Failed to fetch pending payments" });
    }
  });

  app.patch('/api/payments/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const payment = await storage.updatePayment(req.params.id, {
        status: 'approved',
        verifiedBy: userId,
      });

      await storage.createAuditLog(userId, 'payment_approved', { paymentId: payment.id });
      
      res.json(payment);
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ message: "Failed to approve payment" });
    }
  });

  app.patch('/api/payments/:id/reject', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const payment = await storage.updatePayment(req.params.id, {
        status: 'rejected',
        verifiedBy: userId,
      });

      await storage.createAuditLog(userId, 'payment_rejected', { paymentId: payment.id });
      
      res.json(payment);
    } catch (error) {
      console.error("Error rejecting payment:", error);
      res.status(500).json({ message: "Failed to reject payment" });
    }
  });

  // User dashboard routes
  app.get('/api/user/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const participants = await storage.getParticipantsByUser(userId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching user tournaments:", error);
      res.status(500).json({ message: "Failed to fetch user tournaments" });
    }
  });

  // Website purchase routes
  app.post('/api/website-orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = {
        userId,
        amount: 15000, // Fixed price
      };

      const validatedData = insertWebsiteOrderSchema.parse(orderData);
      const order = await storage.createWebsiteOrder(validatedData);
      
      await storage.createAuditLog(userId, 'website_order_created', { orderId: order.id });
      
      res.json(order);
    } catch (error) {
      console.error("Error creating website order:", error);
      res.status(500).json({ message: "Failed to create website order" });
    }
  });

  app.get('/api/website-orders/pending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getWebsiteOrders();
      res.json(orders.filter(order => order.status === 'pending'));
    } catch (error) {
      console.error("Error fetching pending website orders:", error);
      res.status(500).json({ message: "Failed to fetch pending website orders" });
    }
  });

  app.patch('/api/website-orders/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const downloadToken = randomUUID();
      const downloadExpiresAt = new Date();
      downloadExpiresAt.setDate(downloadExpiresAt.getDate() + 7); // 7 days from now

      const order = await storage.updateWebsiteOrder(req.params.id, {
        status: 'approved',
        downloadToken,
        downloadExpiresAt,
      });

      await storage.createAuditLog(userId, 'website_order_approved', { orderId: order.id });
      
      res.json(order);
    } catch (error) {
      console.error("Error approving website order:", error);
      res.status(500).json({ message: "Failed to approve website order" });
    }
  });

  // Download website source
  app.get('/api/download/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const orders = await storage.getWebsiteOrders();
      const order = orders.find(o => o.downloadToken === token);
      
      if (!order || order.status !== 'approved') {
        return res.status(404).json({ message: "Invalid download link" });
      }

      if (order.downloadExpiresAt && new Date() > order.downloadExpiresAt) {
        return res.status(410).json({ message: "Download link has expired" });
      }

      // In a real implementation, you would create and serve a ZIP file
      res.json({ message: "Download would start here", sourceCode: "Complete PHP source code would be provided as a ZIP file" });
    } catch (error) {
      console.error("Error downloading source:", error);
      res.status(500).json({ message: "Failed to download source code" });
    }
  });

  // Enhanced Admin Analytics Routes
  app.get('/api/admin/analytics/:period', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { period } = req.params; // 'daily', 'weekly', 'monthly'
      const analytics = await storage.getAnalytics(period);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin Stats Overview
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Admin Notifications
  app.get('/api/admin/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const notifications = await storage.getAdminNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.post('/api/admin/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  app.post('/api/admin/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.markAllNotificationsAsRead();
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Email Logs
  app.get('/api/admin/email-logs', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const emailLogs = await storage.getEmailLogs();
      res.json(emailLogs);
    } catch (error) {
      console.error("Error fetching email logs:", error);
      res.status(500).json({ message: "Failed to fetch email logs" });
    }
  });

  // SMTP Test
  app.post('/api/admin/test-smtp', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { testEmail } = req.body;
      
      // Test email sending
      const result = await emailService.sendTestEmail(testEmail || user.email);
      
      // Log the test
      await storage.createEmailLog({
        recipientEmail: testEmail || user.email,
        subject: "SMTP Test Email",
        template: "smtp_test",
        status: result.success ? "sent" : "failed",
        error: result.error || null,
        sentAt: result.success ? new Date() : null,
      });

      res.json({ 
        success: result.success, 
        message: result.success ? "Test email sent successfully" : result.error 
      });
    } catch (error) {
      console.error("Error testing SMTP:", error);
      res.status(500).json({ message: "Failed to test SMTP", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Active Users Count
  app.get('/api/admin/active-users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const activeUsers = await storage.getActiveUsersCount();
      res.json({ activeUsers });
    } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({ message: "Failed to fetch active users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
