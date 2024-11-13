import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"

/**
 * Configuration flag for dynamic content rendering.
 */
export const dynamic = "force-dynamic"

/**
 * Router for handling authentication-related procedures.
 */
export const authRouter = router({
  /**
   * Checks if the current user's database record is in sync with the authentication service.
   * 
   * - First, retrieves the currently authenticated user from the Clerk service.
   * - If no authenticated user is found, it returns `isSynced: false`.
   * - If the user is authenticated, it checks if they exist in the database.
   * - If the user doesn't exist in the database, it creates a new record with a default quota.
   * 
   * @returns {object} - An object indicating whether the user is synced (`isSynced: true` or `false`).
   */
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    const auth = await currentUser()

    if (!auth) {
      // Return false if there is no authenticated user
      return c.json({ isSynced: false })
    }

    // Search for the user in the database by their external authentication ID
    const user = await db.user.findFirst({
      where: { externalId: auth.id },
    })

    console.log('USER IN DB:', user)

    // If user is not found, create a new database record for the user
    if (!user) {
      await db.user.create({
        data: {
          quotaLimit: 1000, // Default quota limit for a new user
          externalId: auth.id,
          email: auth.emailAddresses[0].emailAddress,
        },
      })
    }

    // Return true if the user is authenticated and in sync with the database
    return c.json({ isSynced: true })
  }),
})

