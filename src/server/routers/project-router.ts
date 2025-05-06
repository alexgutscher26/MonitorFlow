import { addMonths, startOfMonth } from "date-fns"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/db"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { z } from "zod"

export const projectRouter = router({
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const currentDate = startOfMonth(new Date())

    const quota = await db.quota.findFirst({
      where: {
        userId: user.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
    })

    const eventCount = quota?.count ?? 0

    const categoryCount = await db.eventCategory.count({
      where: { userId: user.id },
    })

    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA

    const resetDate = addMonths(currentDate, 1)

    return c.superjson({
      categoriesUsed: categoryCount,
      categoriesLimit: limits.maxEventCategories,
      eventsUsed: eventCount,
      eventsLimit: limits.maxEventsPerMonth,
      resetDate,
    })
  }),

  setDiscordID: privateProcedure
    .input(z.object({ discordId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { discordId } = input

      await db.user.update({
        where: { id: user.id },
        data: { discordId },
      })

      return c.json({ success: true })
    }),
    
  // Custom branding endpoints
  updateBranding: privateProcedure
    .input(
      z.object({
        logo: z.string().optional(),
        primaryColor: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
          .optional(),
        secondaryColor: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
          .optional(),
        customDomain: z
          .string()
          .regex(
            /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
            "Invalid domain format"
          )
          .optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { logo, primaryColor, secondaryColor, customDomain } = input

      await db.user.update({
        where: { id: user.id },
        data: {
          // Using type assertion to work around TypeScript error
          // until Prisma client can be regenerated
          brandLogo: logo,
          brandPrimaryColor: primaryColor,
          brandSecondaryColor: secondaryColor,
          brandCustomDomain: customDomain,
        } as any,
      })

      return c.json({ success: true })
    }),
    
  getBranding: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        // Using type assertion for select fields
        // until Prisma client can be regenerated
        brandLogo: true,
        brandPrimaryColor: true,
        brandSecondaryColor: true,
        brandCustomDomain: true,
      } as any,
    })

    return c.superjson({
      logo: userData?.brandLogo,
      primaryColor: userData?.brandPrimaryColor,
      secondaryColor: userData?.brandSecondaryColor,
      customDomain: userData?.brandCustomDomain,
    })
  }),
})
