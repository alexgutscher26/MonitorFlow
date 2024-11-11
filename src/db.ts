import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

declare global {
  // Declare a global variable for Prisma client caching in development.
  // Move the var declaration to the top of the scope.
  var cachedPrisma: PrismaClient | undefined
}

/**
 * Initializes a Prisma client for database interaction, using a connection pool from `@neondatabase/serverless`.
 * In production, a new Prisma client is created for each execution.
 * In development, a global cached instance is used to avoid redundant connections on every reload.
 */
let prisma: PrismaClient

// Use separate configurations for production and development environments
if (process.env.NODE_ENV === "production") {
  // Production: Initialize a new Prisma client for each process
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  // Development: Cache the Prisma client to prevent creating multiple connections
  if (!global.cachedPrisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    global.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = global.cachedPrisma
}

/**
 * Exported database client for use across the application.
 */
export const db = prisma
