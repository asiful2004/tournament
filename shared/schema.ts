import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  isAgeVerified: boolean("is_age_verified").default(false),
  role: varchar("role").default("user"), // user, admin, super_admin
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  acceptedTerms: boolean("accepted_terms").default(false),
  acceptedPrivacy: boolean("accepted_privacy").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tournament status enum
export const tournamentStatusEnum = pgEnum('tournament_status', ['draft', 'published', 'live', 'finished', 'cancelled']);

// Game mode enum
export const gameModeEnum = pgEnum('game_mode', ['solo', 'squad']);

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  bannerUrl: varchar("banner_url"),
  game: varchar("game").default("Free Fire"),
  gameMode: gameModeEnum("game_mode").notNull(),
  startTime: timestamp("start_time").notNull(),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  prize1: decimal("prize_1", { precision: 10, scale: 2 }),
  prize2: decimal("prize_2", { precision: 10, scale: 2 }),
  prize3: decimal("prize_3", { precision: 10, scale: 2 }),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  partyCode: varchar("party_code"),
  maxParticipants: integer("max_participants"),
  status: tournamentStatusEnum("status").default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment method enum
export const paymentMethodEnum = pgEnum('payment_method', ['bkash', 'nagad']);

// Payment status enum
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'approved', 'rejected']);

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tournamentId: varchar("tournament_id").references(() => tournaments.id),
  websiteOrderId: varchar("website_order_id"),
  method: paymentMethodEnum("method").notNull(),
  payerNumber: varchar("payer_number").notNull(),
  txnId: varchar("txn_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("pending"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Participant status enum
export const participantStatusEnum = pgEnum('participant_status', ['pending_payment', 'pending_verify', 'approved', 'rejected']);

// Participants table
export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tournamentId: varchar("tournament_id").references(() => tournaments.id).notNull(),
  paymentId: varchar("payment_id").references(() => payments.id),
  status: participantStatusEnum("status").default("pending_payment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email reminders table
export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantId: varchar("participant_id").references(() => participants.id).notNull(),
  milestone: varchar("milestone").notNull(), // m30, m20, m5
  sentAt: timestamp("sent_at").defaultNow(),
});

// Website orders table
export const websiteOrders = pgTable("website_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  paymentId: varchar("payment_id").references(() => payments.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected, delivered
  downloadToken: varchar("download_token"),
  downloadExpiresAt: timestamp("download_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id").references(() => users.id),
  action: varchar("action").notNull(),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings table for admin configuration
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").unique().notNull(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true });
export const insertWebsiteOrderSchema = createInsertSchema(websiteOrders).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingsSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type WebsiteOrder = typeof websiteOrders.$inferSelect;
export type InsertWebsiteOrder = z.infer<typeof insertWebsiteOrderSchema>;

// Email logs for tracking email delivery status
export const emailLogs = pgTable("email_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  template: text("template"), // email template name
  status: text("status").notNull().default("pending"), // 'pending', 'sent', 'failed', 'delivered'
  error: text("error"), // error message if failed
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  tournamentId: text("tournament_id").references(() => tournaments.id),
  userId: text("user_id").references(() => users.id),
});

// Site analytics for visitor tracking
export const siteAnalytics = pgTable("site_analytics", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD format
  uniqueVisitors: integer("unique_visitors").default(0),
  totalPageViews: integer("total_page_views").default(0),
  newRegistrations: integer("new_registrations").default(0),
  tournamentJoins: integer("tournament_joins").default(0),
  totalRevenue: integer("total_revenue").default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active sessions for real-time user counting
export const activeSessions = pgTable("active_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: text("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin notifications for real-time alerts
export const adminNotifications = pgTable("admin_notifications", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'new_participant', 'new_payment', 'tournament_full', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  relatedId: text("related_id"), // tournament_id, user_id, etc.
  relatedType: text("related_type"), // 'tournament', 'user', 'payment', etc.
});

// Additional insert schemas and types
export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({ id: true, createdAt: true });
export const insertSiteAnalyticsSchema = createInsertSchema(siteAnalytics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertActiveSessionSchema = createInsertSchema(activeSessions).omit({ createdAt: true });
export const insertAdminNotificationSchema = createInsertSchema(adminNotifications).omit({ id: true, createdAt: true });

export type EmailLog = typeof emailLogs.$inferSelect;
export type SiteAnalytics = typeof siteAnalytics.$inferSelect;
export type ActiveSession = typeof activeSessions.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type InsertSiteAnalytics = z.infer<typeof insertSiteAnalyticsSchema>;
export type InsertActiveSession = z.infer<typeof insertActiveSessionSchema>;
export type InsertAdminNotification = z.infer<typeof insertAdminNotificationSchema>;
