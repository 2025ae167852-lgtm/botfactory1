import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password"), // For local auth if needed, or placeholder
  subscriptionPlan: text("subscription_plan").default("free"),
  subscriptionLimits: jsonb("subscription_limits").$type<{
    bots: number;
    messages: number;
    platforms: number;
  }>().default({ bots: 3, messages: 1000, platforms: 1 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(), // whatsapp, telegram, messenger, web
  flow: jsonb("flow").notNull().default({ nodes: [], edges: [] }), // React Flow JSON
  settings: jsonb("settings").$type<{
    welcomeMessage?: string;
    fallbackMessage?: string;
    workingHours?: { enabled: boolean; start: string; end: string; timezone: string };
    humanTakeover?: boolean;
  }>(),
  userId: integer("user_id"), // Optional FK, nullable for now
  isActive: boolean("is_active").default(true),
  stats: jsonb("stats").$type<{
    totalMessages: number;
    activeUsers: number;
    completionRate: number;
  }>().default({ totalMessages: 0, activeUsers: 0, completionRate: 0 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").references(() => bots.id),
  userId: text("user_id"), // External platform user ID
  platform: text("platform"),
  direction: text("direction"), // incoming, outgoing
  content: jsonb("content").notNull(), // { type, text, mediaUrl, buttons }
  timestamp: timestamp("timestamp").defaultNow(),
  sessionId: text("session_id"),
});

// === RELATIONS ===

export const botsRelations = relations(bots, ({ one, many }) => ({
  user: one(users, {
    fields: [bots.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  bot: one(bots, {
    fields: [messages.botId],
    references: [bots.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBotSchema = createInsertSchema(bots).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });

// === EXPLICIT API CONTRACT TYPES ===

export type AppUser = typeof users.$inferSelect; // Renamed to avoid conflict with Replit Auth User
export type InsertAppUser = z.infer<typeof insertUserSchema>;

export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Request Types
export type CreateBotRequest = InsertBot;
export type UpdateBotRequest = Partial<InsertBot>;
export type BotFlowUpdateRequest = { flow: any }; // JSONB flow

// Response Types
export type BotResponse = Bot;
export type BotsListResponse = Bot[];
export type DashboardStatsResponse = {
  totalMessages: number;
  totalBots: number;
  activeBots: number;
  platformDistribution: Record<string, number>;
};
