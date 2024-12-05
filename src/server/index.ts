import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { authRouter } from "./routers/auth-router";
import { categoryRouter } from "./routers/category-router";
import { paymentRouter } from "./routers/payment-router";
import { projectRouter } from "./routers/project-router";
import { incidentActionRouter } from "./routers/incident-action-router";
import { slaRouter } from "./routers/sla-router";

/**
 * Create the base Hono application with API prefix and CORS support
 */
const app = new Hono()
  .basePath("/api")
  // Add CORS middleware with proper configuration
  .use("*", cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  }))
  // Add request logging in development
  .use("*", logger())
  // Add pretty JSON formatting in development
  .use("*", prettyJSON());

/**
 * Global error handling middleware
 */
app.onError((err, c) => {
  console.error("Server error:", err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction ? "Internal Server Error" : err.message;

  return c.json(
    {
      error: {
        message,
        status: 500,
      },
    },
    500
  );
});

/**
 * Health check endpoint
 */
app.get("/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

/**
 * API Router Configuration
 * All routers added in /server/routers should be manually added here.
 * Routes are prefixed with their respective paths.
 */
const appRouter = app
  .route("/auth", authRouter)
  .route("/category", categoryRouter)
  .route("/payment", paymentRouter)
  .route("/project", projectRouter)
  .route("/incident-action", incidentActionRouter)
  .route("/sla", slaRouter);

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * Export the app for deployment to Cloudflare's edge network
 * Run `npm run deploy` for one-click API deployment
 */
export default app;

/**
 * Export type definition of API for type-safe client usage
 */
export type AppType = typeof appRouter;

// Extend ProcessEnv interface in a separate file if needed
// src/types/env.d.ts can be created for this purpose
