import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { HTTPException } from "hono/http-exception"

export const dynamic = "force-dynamic"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ input, ctx, c }) => {
    try {
      const auth = await currentUser()

      if (!auth) {
        return c.json({ isSynced: false, error: "No authenticated user found" })
      }

      if (!auth.emailAddresses || auth.emailAddresses.length === 0) {
        return c.json({ isSynced: false, error: "No email address found for user" })
      }

      try {
        // First check if a user with this email already exists
        const existingUserByEmail = await db.user.findFirst({
          where: { email: auth.emailAddresses[0].emailAddress },
        })

        if (existingUserByEmail) {
          return c.json({ 
            isSynced: false, 
            error: "User with this email already exists. Please use a different email."
          })
        }

        const user = await db.user.findFirst({
          where: { externalId: auth.id },
        })

        if (!user) {
          try {
            await db.user.create({
              data: {
                quotaLimit: 100,
                externalId: auth.id,
                email: auth.emailAddresses[0].emailAddress,
              },
            })
          } catch (createError) {
            console.error('Failed to create user:', createError)
            if (createError instanceof Error && createError.message.includes('Unique constraint')) {
              return c.json({ 
                isSynced: false, 
                error: "User with this email already exists. Please use a different email."
              })
            }
            if (createError instanceof Error && createError.message.includes('Foreign key')) {
              return c.json({ 
                isSynced: false, 
                error: "Invalid external ID. Please try signing in again."
              })
            }
            return c.json({ 
              isSynced: false, 
              error: "Database error while creating user. Please try again."
            })
          }
        }

        return c.json({ isSynced: true })
      } catch (dbError) {
        console.error('Database query failed:', dbError)
        return c.json({ 
          isSynced: false, 
          error: "Database connection error. Please try again later."
        })
      }
    } catch (error) {
      console.error('Error in getDatabaseSyncStatus:', error)
      throw new HTTPException(500, { 
        message: error instanceof Error ? error.message : 'Internal server error'
      })
    }
  }),
})

// route.ts