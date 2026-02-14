import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error.middleware.js";
import chatRoutes from "./routes/chat.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = new Hono();

// Middleware
app.use("*", async (c, next) => {
  // Polyfill for headers.get if it's missing (happens in some Vercel environments)
  if (
    c.req.raw &&
    c.req.raw.headers &&
    typeof c.req.raw.headers.get !== "function"
  ) {
    const rawHeaders = c.req.raw.headers as any;
    const headersInstance = new Headers();
    for (const [key, value] of Object.entries(rawHeaders)) {
      if (Array.isArray(value)) {
        value.forEach((v) => headersInstance.append(key, v));
      } else if (typeof value === "string") {
        headersInstance.set(key, value);
      }
    }
    // @ts-ignore - overriding readonly property for fix
    Object.defineProperty(c.req.raw, "headers", {
      value: headersInstance,
      writable: true,
      configurable: true,
    });
  }
  await next();
});
app.use(
  "*",
  cors({
    origin: ["https://raghav-mas.netlify.app", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["x-conversation-id"],
  }),
);
app.use("*", logger());

app.options("*", (c) => {
  return c.text("", 204);
});

import seed from "../prisma/seed.js";

app.get("/", (c) => c.text("Multi-Agent API is running"));

app.get("/seed", async (c) => {
  try {
    await seed();
    return c.json({ message: "Database seeded successfully" });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);
app.get("/api/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// Routes
app.route("/api/chat", chatRoutes);
app.route("/api/agents", agentRoutes);

// 404 Handling
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `Route not found: ${c.req.method} ${c.req.path}`,
    },
    404,
  );
});

// Error Handling
app.onError((err, c) => {
  console.error(`[Error ${c.req.method} ${c.req.path}]: ${err.message}`);
  return errorHandler(err, c);
});

const port = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== "production" || process.env.RUN_LOCAL === "true") {
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
