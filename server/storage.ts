import {
  users,
  tournaments,
  payments,
  participants,
  websiteOrders,
  auditLogs,
  reminders,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
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
}

export const storage = new DatabaseStorage();
