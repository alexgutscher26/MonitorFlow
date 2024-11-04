// src/server/index.ts

// Importing Hono modules and middlewares
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

// Importing routers
import { categoryRouter } from "./routers/category-router";
import { projectRouter } from "./routers/project-router";
import { authRouter } from "./routers/auth-router";
import { paymentRouter } from "./routers/payment-router";

// Initializing the Hono app with base path and CORS middleware
const app = new Hono().basePath("/api").use(cors());

/**
 * Primary application router setup for Hono
 * Including all routes
 */
app
  .route("/auth", authRouter)
  .route("/category", categoryRouter)
  .route("/payment", paymentRouter)
  .route("/project", projectRouter)

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;

// Export type definition of API
export type AppType = typeof app;