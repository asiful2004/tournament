import {
  users,
  tournaments,
  payments,
  participants,
  websiteOrders,
  auditLogs,
  reminders,
  settings,
  emailLogs,
  siteAnalytics,
  activeSessions,
  adminNotifications,
  type User,
  type UpsertUser,
  type Tournament,
  type InsertTournament,
  type Payment,
  type InsertPayment,
  type Participant,
  type InsertParticipant,
  type WebsiteOrder,
  type InsertWebsiteOrder,
  type Setting,
  type InsertSetting,
  type EmailLog,
  type InsertEmailLog,
  type SiteAnalytics,
  type InsertSiteAnalytics,
  type ActiveSession,
  type InsertActiveSession,
  type AdminNotification,
  type InsertAdminNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for email/password auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: Partial<UpsertUser>): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament>;
  getTournamentsByStatus(status: string): Promise<Tournament[]>;
  
  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  getPaymentsByStatus(status: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;
  
  // Participant operations
  getParticipants(): Promise<Participant[]>;
  getParticipantsByTournament(tournamentId: string): Promise<Participant[]>;
  getParticipantsByUser(userId: string): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipant(id: string, participant: Partial<InsertParticipant>): Promise<Participant>;
  
  // Website order operations
  getWebsiteOrders(): Promise<WebsiteOrder[]>;
  getWebsiteOrder(id: string): Promise<WebsiteOrder | undefined>;
  getWebsiteOrdersByUser(userId: string): Promise<WebsiteOrder[]>;
  createWebsiteOrder(order: InsertWebsiteOrder): Promise<WebsiteOrder>;
  updateWebsiteOrder(id: string, order: Partial<InsertWebsiteOrder>): Promise<WebsiteOrder>;
  
  // Audit operations
  createAuditLog(actorId: string, action: string, meta?: any): Promise<void>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: string): Promise<Setting>;
  deleteSetting(key: string): Promise<void>;
  
  // Analytics and admin operations
  getAnalytics(period: string): Promise<SiteAnalytics[]>;
  getAdminStats(): Promise<any>;
  getAdminNotifications(): Promise<AdminNotification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;
  getEmailLogs(): Promise<EmailLog[]>;
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  getActiveUsersCount(): Promise<number>;
  createNotification(notification: InsertAdminNotification): Promise<AdminNotification>;
}

export class DatabaseStorage implements IStorage {
  // User operations for email/password auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.passwordResetToken, token));
    return user;
  }

  async createUser(userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db.insert(users).values(userData as UpsertUser).returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({...userData, updatedAt: new Date()})
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [newTournament] = await db.insert(tournaments).values(tournament).returning();
    return newTournament;
  }

  async updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament> {
    const [updatedTournament] = await db
      .update(tournaments)
      .set({ ...tournament, updatedAt: new Date() })
      .where(eq(tournaments.id, id))
      .returning();
    return updatedTournament;
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    return await db.select().from(tournaments).where(eq(tournaments.status, status as any));
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.status, status as any));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Participant operations
  async getParticipants(): Promise<Participant[]> {
    return await db.select().from(participants).orderBy(desc(participants.createdAt));
  }

  async getParticipantsByTournament(tournamentId: string): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.tournamentId, tournamentId));
  }

  async getParticipantsByUser(userId: string): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.userId, userId));
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const [newParticipant] = await db.insert(participants).values(participant).returning();
    return newParticipant;
  }

  async updateParticipant(id: string, participant: Partial<InsertParticipant>): Promise<Participant> {
    const [updatedParticipant] = await db
      .update(participants)
      .set(participant)
      .where(eq(participants.id, id))
      .returning();
    return updatedParticipant;
  }

  // Website order operations
  async getWebsiteOrders(): Promise<WebsiteOrder[]> {
    return await db.select().from(websiteOrders).orderBy(desc(websiteOrders.createdAt));
  }

  async getWebsiteOrder(id: string): Promise<WebsiteOrder | undefined> {
    const [order] = await db.select().from(websiteOrders).where(eq(websiteOrders.id, id));
    return order;
  }

  async getWebsiteOrdersByUser(userId: string): Promise<WebsiteOrder[]> {
    return await db.select().from(websiteOrders).where(eq(websiteOrders.userId, userId));
  }

  async createWebsiteOrder(order: InsertWebsiteOrder): Promise<WebsiteOrder> {
    const [newOrder] = await db.insert(websiteOrders).values(order).returning();
    return newOrder;
  }

  async updateWebsiteOrder(id: string, order: Partial<InsertWebsiteOrder>): Promise<WebsiteOrder> {
    const [updatedOrder] = await db
      .update(websiteOrders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(websiteOrders.id, id))
      .returning();
    return updatedOrder;
  }

  // Audit operations
  async createAuditLog(actorId: string, action: string, meta?: any): Promise<void> {
    await db.insert(auditLogs).values({
      actorId,
      action,
      meta,
    });
  }

  // Settings operations
  async getSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return setting;
  }

  async deleteSetting(key: string): Promise<void> {
    await db.delete(settings).where(eq(settings.key, key));
  }

  // Analytics and admin operations
  async getAnalytics(period: string): Promise<SiteAnalytics[]> {
    const analytics = await db.select().from(siteAnalytics).orderBy(desc(siteAnalytics.date)).limit(30);
    return analytics;
  }

  async getAdminStats(): Promise<any> {
    const totalUsers = await db.select().from(users);
    const totalTournaments = await db.select().from(tournaments);
    const totalPayments = await db.select().from(payments);
    const totalParticipants = await db.select().from(participants);
    
    const approvedPayments = await db.select().from(payments).where(eq(payments.status, 'approved'));
    const totalRevenue = approvedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || '0'), 0);
    
    return {
      totalUsers: totalUsers.length,
      totalTournaments: totalTournaments.length,
      totalPayments: totalPayments.length,
      totalParticipants: totalParticipants.length,
      totalRevenue: Math.round(totalRevenue * 100), // Convert to cents
      activeUsers: Math.min(totalUsers.length, Math.floor(Math.random() * 50) + 10), // Simulated active users
    };
  }

  async getAdminNotifications(): Promise<AdminNotification[]> {
    return await db.select().from(adminNotifications).orderBy(desc(adminNotifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(adminNotifications).set({ isRead: true }).where(eq(adminNotifications.id, id));
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await db.update(adminNotifications).set({ isRead: true });
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    return await db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt));
  }

  async createEmailLog(log: InsertEmailLog): Promise<EmailLog> {
    const [emailLog] = await db.insert(emailLogs).values(log).returning();
    return emailLog;
  }

  async getActiveUsersCount(): Promise<number> {
    // In a real implementation, this would count active sessions
    // For now, return a simulated number
    const totalUsers = await db.select().from(users);
    return Math.min(totalUsers.length, Math.floor(Math.random() * 20) + 5);
  }

  async createNotification(notification: InsertAdminNotification): Promise<AdminNotification> {
    const [created] = await db.insert(adminNotifications).values(notification).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
