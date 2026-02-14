import * as dotenv from "dotenv";
// Initialize dotenv as early as possible
dotenv.config();

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error.middleware.js";
import chatRoutes from "./routes/chat.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import seed from "../prisma/seed.js";

const app = new Hono();

// 1. CORS Middleware (Must be first)
app.use(
  "*",
  cors({
    origin: (origin) => {
      // For production, we want to allow the specific Netlify origin or reflect back
      // Reflecting origin is generally safe if we trust the clients, but better for debugging
      return origin || "*";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept", "x-conversation-id"],
    exposeHeaders: ["x-conversation-id"],
    maxAge: 86400,
    credentials: true,
  }),
);

// 2. Logger
app.use("*", logger());

// 3. Health Check & Base Routes
app.get("/", (c) => c.text("Multi-Agent API is running"));

app.get("/api/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

app.get("/seed", async (c) => {
  try {
    await seed();
    return c.json({ message: "Database seeded successfully" });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// 4. API Routes
app.route("/api/chat", chatRoutes);
app.route("/api/agents", agentRoutes);

// 5. 404 Handling
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `Route not found: ${c.req.method} ${c.req.path}`,
    },
    404,
  );
});

// 6. Error Handling
app.onError((err, c) => {
  console.error(`[Error ${c.req.method} ${c.req.path}]: ${err.message}`);
  return errorHandler(err, c);
});

// 7. Explicit OPTIONS handler as a fallback
app.options("*", (c) => {
  return c.body(null, 204);
});

const port = Number(process.env.PORT) || 3000;

// Only start the server if we're not in the Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.RUN_LOCAL === "true") {
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
