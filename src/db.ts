import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient

const initPrisma = () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error("Failed to initialize Prisma:", error)
    throw error
  }
}

if (process.env.NODE_ENV === "production") {
  prisma = initPrisma()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = initPrisma()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
