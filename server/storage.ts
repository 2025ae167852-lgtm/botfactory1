import { db } from "./db";
import {
  users, bots, messages,
  type User, type InsertUser,
  type Bot, type InsertBot, type UpdateBotRequest,
  type Message, type InsertMessage,
  type DashboardStatsResponse
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bots
  getBots(): Promise<Bot[]>;
  getBot(id: number): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: number, updates: UpdateBotRequest): Promise<Bot>;
  deleteBot(id: number): Promise<void>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStatsResponse>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getBots(): Promise<Bot[]> {
    return await db.select().from(bots).orderBy(bots.createdAt);
  }

  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
    const [bot] = await db.insert(bots).values(insertBot).returning();
    return bot;
  }

  async updateBot(id: number, updates: UpdateBotRequest): Promise<Bot> {
    const [updated] = await db.update(bots)
      .set(updates)
      .where(eq(bots.id, id))
      .returning();
    return updated;
  }

  async deleteBot(id: number): Promise<void> {
    await db.delete(bots).where(eq(bots.id, id));
  }

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const allBots = await db.select().from(bots);
    const totalBots = allBots.length;
    const activeBots = allBots.filter(b => b.isActive).length;
    
    // Calculate platform distribution
    const platformDistribution: Record<string, number> = {};
    allBots.forEach(bot => {
      platformDistribution[bot.platform] = (platformDistribution[bot.platform] || 0) + 1;
    });

    // Mock message count for now, or aggregate from messages table
    const totalMessages = 1250; 

    return {
      totalMessages,
      totalBots,
      activeBots,
      platformDistribution
    };
  }
}

export const storage = new DatabaseStorage();
