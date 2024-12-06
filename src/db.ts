import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Prisma, PrismaClient } from "@prisma/client"
import { retry } from "./utils"

// Custom error class for database-related errors
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

// Configuration type for database initialization
interface DbConfig {
  connectionString: string
  maxPoolSize?: number
  connectionTimeout?: number
  idleTimeout?: number
  maxRetries?: number
  debug?: boolean
}

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
  var cachedPool: Pool
}

// Initialize prisma as null initially
let prisma: PrismaClient | null = null
let pool: Pool | null = null
let initializationPromise: Promise<PrismaClient> | null = null

/**
 * Creates a new database pool with the given configuration
 */
const createPool = (config: DbConfig): Pool => {
  try {
    return new Pool({
      connectionString: config.connectionString,
      max: config.maxPoolSize || 20,
      connectionTimeoutMillis: config.connectionTimeout || 10000,
      idleTimeoutMillis: config.idleTimeout || 60000,
    })
  } catch (error) {
    throw new DatabaseError("Failed to create database pool", error)
  }
}

/**
 * Initializes Prisma client with the given configuration
 */
const initPrisma = async (config: DbConfig): Promise<PrismaClient> => {
  try {
    // Initialize the connection pool
    pool = createPool(config)
    global.cachedPool = pool

    // Create Prisma adapter with the pool
    const adapter = new PrismaNeon(pool)

    // Initialize Prisma client with the adapter
    const client = new PrismaClient({
      adapter,
      log: [], // Disable all logging
    })

    // Test the connection
    await client.$connect()

    return client
  } catch (error) {
    throw new DatabaseError("Failed to initialize Prisma client", error)
  }
}

/**
 * Initializes the database connection with retries
 */
const initDatabase = async (): Promise<PrismaClient> => {
  const config: DbConfig = {
    connectionString: process.env.DATABASE_URL!,
    maxPoolSize: process.env.DB_MAX_CONNECTIONS
      ? parseInt(process.env.DB_MAX_CONNECTIONS)
      : 20,
    connectionTimeout: process.env.DB_CONNECTION_TIMEOUT
      ? parseInt(process.env.DB_CONNECTION_TIMEOUT)
      : 10000,
    idleTimeout: process.env.DB_IDLE_TIMEOUT
      ? parseInt(process.env.DB_IDLE_TIMEOUT)
      : 60000,
    maxRetries: process.env.DB_MAX_RETRIES
      ? parseInt(process.env.DB_MAX_RETRIES)
      : 3,
    debug: process.env.NODE_ENV !== "production",
  }

  return retry(() => initPrisma(config), config.maxRetries, 1000)
}

// Initialize database connection based on environment
if (!initializationPromise) {
  initializationPromise = (async () => {
    try {
      if (process.env.NODE_ENV === "production") {
        const client = await initDatabase()
        prisma = client
        return client
      } else {
        if (!global.cachedPrisma) {
          const client = await initDatabase()
          global.cachedPrisma = client
          prisma = client
          return client
        } else {
          prisma = global.cachedPrisma
          return prisma
        }
      }
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw new DatabaseError("Failed to initialize database", error)
    }
  })()
}

// Ensure database is initialized before proceeding
const ensureInit = async (): Promise<PrismaClient> => {
  if (!initializationPromise) {
    throw new DatabaseError("Database initialization was not started")
  }

  try {
    if (!prisma) {
      prisma = await initializationPromise
    }

    if (!prisma) {
      throw new DatabaseError("Database initialization failed")
    }

    return prisma
  } catch (error) {
    console.error("Error ensuring database initialization:", error)
    throw new DatabaseError("Failed to ensure database initialization", error)
  }
}

// Transaction options interface
interface TransactionOptions {
  maxWait?: number // Maximum time to wait for transaction in milliseconds
  timeout?: number // Transaction timeout in milliseconds
  isolationLevel?: Prisma.TransactionIsolationLevel
  retries?: number // Number of retries on deadlock
}

// Transaction error types
export enum TransactionErrorType {
  TIMEOUT = "TIMEOUT",
  DEADLOCK = "DEADLOCK",
  SERIALIZATION = "SERIALIZATION",
  CONNECTION = "CONNECTION",
  UNKNOWN = "UNKNOWN",
}

// Custom transaction error class
export class TransactionError extends DatabaseError {
  constructor(
    message: string,
    public readonly type: TransactionErrorType,
    public readonly cause?: unknown
  ) {
    super(message, cause)
    this.name = "TransactionError"
  }
}

/**
 * Executes a function within a transaction with retries and error handling
 */
export const transaction = async <T>(
  fn: (
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> => {
  const db = await ensureInit()
  const {
    maxWait = 5000,
    timeout = 30000,
    isolationLevel = "ReadCommitted",
    retries = 3,
  } = options

  let attempt = 0
  const startTime = Date.now()

  while (attempt < retries) {
    try {
      // Check if we've exceeded maxWait
      if (Date.now() - startTime > maxWait) {
        throw new TransactionError(
          `Transaction exceeded maximum wait time of ${maxWait}ms`,
          TransactionErrorType.TIMEOUT
        )
      }

      // Execute transaction with timeout
      const result = await Promise.race([
        db.$transaction(async (tx) => fn(tx), {
          maxWait,
          isolationLevel,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), timeout)
        ),
      ])

      return result as T
    } catch (error: any) {
      attempt++

      // Handle specific error types
      if (error.code === "P2034" || /deadlock/i.test(error.message)) {
        if (attempt >= retries) {
          throw new TransactionError(
            `Transaction failed after ${retries} retries due to deadlock`,
            TransactionErrorType.DEADLOCK,
            error
          )
        }
        // Exponential backoff before retry
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(100 * Math.pow(2, attempt), 1000))
        )
        continue
      }

      // Handle serialization failures
      if (error.code === "P2037" || /serialization/i.test(error.message)) {
        throw new TransactionError(
          "Transaction failed due to serialization failure",
          TransactionErrorType.SERIALIZATION,
          error
        )
      }

      // Handle connection issues
      if (error.code === "P2028" || /connection/i.test(error.message)) {
        throw new TransactionError(
          "Transaction failed due to connection issue",
          TransactionErrorType.CONNECTION,
          error
        )
      }

      // Handle timeout
      if (error.message === "Transaction timeout") {
        throw new TransactionError(
          `Transaction timed out after ${timeout}ms`,
          TransactionErrorType.TIMEOUT,
          error
        )
      }

      // Handle unknown errors
      throw new TransactionError(
        "Transaction failed due to unknown error",
        TransactionErrorType.UNKNOWN,
        error
      )
    }
  }

  throw new TransactionError(
    `Transaction failed after ${retries} attempts`,
    TransactionErrorType.UNKNOWN
  )
}

/**
 * Gracefully shuts down the database connection
 */
export const disconnect = async (): Promise<void> => {
  const db = await ensureInit()
  try {
    await db.$disconnect()
    if (pool) {
      await pool.end()
    }
  } catch (error) {
    throw new DatabaseError("Failed to disconnect from database", error)
  }
}

/**
 * Checks if the database connection is healthy
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const db = await ensureInit()
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

// Export an async function to get the database instance
export const getDb = async (): Promise<PrismaClient> => ensureInit()

// Export the initialization promise to allow waiting for database readiness
export const dbReady = (): Promise<PrismaClient> =>
  initializationPromise ||
  Promise.reject(new DatabaseError("Database initialization was not started"))

// Export the database instance
// Note: This provides backward compatibility while still ensuring safety
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!prisma) {
      throw new DatabaseError(
        "Database not initialized. Use getDb() or await dbReady() first"
      )
    }
    return prisma[prop as keyof PrismaClient]
  },
})
