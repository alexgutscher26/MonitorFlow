import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { z } from "zod"

const slaConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target: z.number().min(0, "Target must be a positive number"),
  timeWindow: z.string().min(1, "Time window is required"),
  category: z.object({
    name: z.string().min(1, "Category name is required"),
    emoji: z.string().optional(),
  }),
  emailNotifications: z.boolean().default(false),
  webhookNotifications: z.boolean().default(false),
  webhookUrl: z.string().url().optional(),
})

export const slaRouter = router({
  import: privateProcedure
    .input(
      z.object({
        slas: z.array(slaConfigSchema),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { slas } = input

      const results = []
      const errors = []

      for (const sla of slas) {
        try {
          // Find the category
          const category = await db.eventCategory.findFirst({
            where: {
              name: sla.category.name.toLowerCase(),
              userId: user.id,
            },
          })

          if (!category) {
            throw new Error(`Category not found: ${sla.category.name}`)
          }

          // Find existing SLA definition
          const existingSLA = await db.sLADefinition.findFirst({
            where: {
              name: sla.name,
              userId: user.id,
            },
          })

          // Create or update SLA definition
          const slaDefinition = existingSLA
            ? await db.sLADefinition.update({
                where: { id: existingSLA.id },
                data: {
                  target: sla.target,
                  timeWindow: sla.timeWindow,
                  emailNotifications: sla.emailNotifications,
                  webhookNotifications: sla.webhookNotifications,
                  webhookUrl: sla.webhookUrl,
                  category: {
                    connect: {
                      id: category.id,
                    },
                  },
                },
              })
            : await db.sLADefinition.create({
                data: {
                  name: sla.name,
                  target: sla.target,
                  timeWindow: sla.timeWindow,
                  emailNotifications: sla.emailNotifications,
                  webhookNotifications: sla.webhookNotifications,
                  webhookUrl: sla.webhookUrl,
                  userId: user.id,
                  category: {
                    connect: {
                      id: category.id,
                    },
                  },
                },
              })

          results.push({
            name: sla.name,
            status: "success",
            id: slaDefinition.id,
          })
        } catch (error) {
          errors.push({
            name: sla.name,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          })
        }
      }

      return c.json({
        results,
        errors,
        totalProcessed: slas.length,
        successCount: results.length,
        errorCount: errors.length,
      })
    }),

  list: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const slaDefinitions = await db.sLADefinition.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return c.json(slaDefinitions)
  }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { id } = input

      await db.sLADefinition.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      })

      return c.json({ success: true })
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required").optional(),
        target: z
          .number()
          .min(0, "Target must be a positive number")
          .optional(),
        timeWindow: z.string().min(1, "Time window is required").optional(),
        emailNotifications: z.boolean().optional(),
        webhookNotifications: z.boolean().optional(),
        webhookUrl: z.string().url().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { id, ...data } = input

      const slaDefinition = await db.sLADefinition
        .updateMany({
          where: {
            id,
            userId: user.id,
          },
          data,
        })
        .then(async () => {
          // Fetch the updated record
          return db.sLADefinition.findFirstOrThrow({
            where: {
              id,
              userId: user.id,
            },
          })
        })

      return c.json(slaDefinition)
    }),
})
