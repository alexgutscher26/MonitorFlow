import { addMonths, startOfMonth } from "date-fns"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/db"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { z } from "zod"

/**
 * Router for project-related API endpoints.
 */
export const projectRouter = router({
  /**
   * Fetches the user's current usage statistics for event categories and events.
   * 
   * - Retrieves the user's quota for the current month and calculates used event count.
   * - Fetches the count of event categories created by the user.
   * - Determines limits based on the user's subscription plan (free or pro).
   * - Calculates the date when the quota resets (start of the next month).
   *
   * @returns {object} - An object containing usage stats, limits, and reset date.
   */
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx
    const currentDate = startOfMonth(new Date())

    // Retrieve the current month's quota for the user
    const quota = await db.quota.findFirst({
      where: {
        userId: user.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
    })

    const eventCount = quota?.count ?? 0 // Default to 0 if no quota record is found

    // Count the number of event categories for the user
    const categoryCount = await db.eventCategory.count({
      where: { userId: user.id },
    })

    // Determine usage limits based on the user's plan
    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA

    // Calculate the reset date (start of the next month)
    const resetDate = addMonths(currentDate, 1)

    return c.superjson({
      categoriesUsed: categoryCount,
      categoriesLimit: limits.maxEventCategories,
      eventsUsed: eventCount,
      eventsLimit: limits.maxEventsPerMonth,
      resetDate,
    })
  }),

  /**
   * Updates the user's Discord ID in the database.
   * 
   * - Validates the input using Zod to ensure the `discordId` is a string with a max length of 20.
   * - Updates the user's record with the new Discord ID.
   *
   * @param {object} input - An object containing the Discord ID to be set.
   * @returns {object} - Success message upon completion.
   */
  setDiscordID: privateProcedure
    .input(z.object({ discordId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { discordId } = input

      // Update the user's Discord ID in the database
      await db.user.update({
        where: { id: user.id },
        data: { discordId },
      })

      return c.json({ success: true })
    }),
})
