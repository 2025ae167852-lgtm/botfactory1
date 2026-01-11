import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Auth (Mock/Simple for now, replace with Replit Auth or Passport later)
  app.post(api.auth.register.path, async (req, res) => {

    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    // Simple mock login
    const { username } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json(user);
  });

  // Dashboard
  app.get(api.dashboard.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Bots
  app.get(api.bots.list.path, async (req, res) => {
    const bots = await storage.getBots();
    res.json(bots);
  });

  app.post(api.bots.create.path, async (req, res) => {
    try {
      const input = api.bots.create.input.parse(req.body);
      const bot = await storage.createBot(input);
      res.status(201).json(bot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.bots.get.path, async (req, res) => {
    const bot = await storage.getBot(Number(req.params.id));
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }
    res.json(bot);
  });

  app.put(api.bots.update.path, async (req, res) => {
    try {
      const input = api.bots.update.input.parse(req.body);
      const bot = await storage.updateBot(Number(req.params.id), input);
      res.json(bot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(404).json({ message: "Bot not found" });
      }
    }
  });

  app.delete(api.bots.delete.path, async (req, res) => {
    await storage.deleteBot(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const bots = await storage.getBots();
  if (bots.length === 0) {
    console.log("Seeding database...");
    
    // Create demo user
    const user = await storage.createUser({
      username: "demo_user",
      email: "demo@example.com",
      password: "password123", // plaintext for mock
      subscriptionPlan: "pro"
    });

    // Create demo bots
    await storage.createBot({
      name: "Customer Support Bot",
      description: "Handles common support queries",
      platform: "whatsapp",
      flow: {
        nodes: [
          { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 } },
          { id: '2', data: { label: 'Welcome Message' }, position: { x: 100, y: 100 } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' }
        ]
      },
      settings: { welcomeMessage: "Hi there! How can I help?" },
      userId: user.id,
      stats: { totalMessages: 150, activeUsers: 45, completionRate: 85 }
    });

    await storage.createBot({
      name: "Sales Assistant",
      description: "Qualifies leads automatically",
      platform: "web",
      flow: { nodes: [], edges: [] },
      settings: { welcomeMessage: "Welcome to our store!" },
      userId: user.id,
      stats: { totalMessages: 89, activeUsers: 12, completionRate: 60 }
    });
  }
}
