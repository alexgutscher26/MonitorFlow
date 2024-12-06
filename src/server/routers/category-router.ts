import { getDb } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { z } from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"
import { ActionExecutor } from "../services/action-executor"
import { nanoid } from "nanoid"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const checkThresholds = async (event: any, category: any) => {
  try {
    const prisma = await getDb()
    const thresholds = await prisma.alertThreshold.findMany({
      where: {
        categoryId: category.id,
        enabled: true,
      },
    })

    const alerts = []

    for (const threshold of thresholds) {
      try {
        const fieldValue = event.fields[threshold.fieldPath]
        if (!fieldValue) continue

        let isTriggered = false
        const thresholdValue = threshold.threshold

        switch (threshold.condition) {
          case "GREATER_THAN":
            isTriggered = Number(fieldValue) > Number(thresholdValue)
            break
          case "LESS_THAN":
            isTriggered = Number(fieldValue) < Number(thresholdValue)
            break
          case "EQUALS":
            isTriggered = String(fieldValue) === String(thresholdValue)
            break
          case "CONTAINS":
            isTriggered = String(fieldValue).includes(String(thresholdValue))
            break
          case "NOT_CONTAINS":
            isTriggered = !String(fieldValue).includes(String(thresholdValue))
            break
        }

        if (isTriggered) {
          alerts.push({
            name: threshold.name,
            condition: threshold.condition,
            fieldPath: threshold.fieldPath,
            actualValue: fieldValue,
            thresholdValue,
          })
        }

        // Add a small delay between checks to avoid rate limiting
        await delay(100)
      } catch (error) {
        console.error(`Error checking threshold ${threshold.name}:`, error)
        continue
      }
    }

    return alerts
  } catch (error) {
    console.error("Error in checkThresholds:", error)
    return []
  }
}

const formatEventMessage = (fields: any) => {
  return Object.keys(fields)
    .map((key) => `${key}: ${fields[key]}`)
    .join("\n")
}

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    try {
      const prisma = await getDb()
      const now = new Date()
      const firstDayOfMonth = startOfMonth(now)

      const categories = await prisma.eventCategory.findMany({
        where: { userId: ctx.user.id },
        select: {
          id: true,
          name: true,
          emoji: true,
          color: true,
          updatedAt: true,
          createdAt: true,
          events: {
            where: { createdAt: { gte: firstDayOfMonth } },
            select: {
              fields: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              events: {
                where: { createdAt: { gte: firstDayOfMonth } },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      })

      const categoriesWithCounts = categories.map(
        (category: {
          events: any[]
          id: any
          name: any
          emoji: any
          color: any
          updatedAt: any
          createdAt: any
          _count: { events: any }
        }) => {
          const uniqueFieldNames = new Set<string>()
          let lastPing: Date | null = null

          category.events.forEach(
            (event: { fields: object; createdAt: number | Date | null }) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                uniqueFieldNames.add(fieldName)
              })
              if (
                !lastPing ||
                (event.createdAt &&
                  new Date(event.createdAt).getTime() > lastPing.getTime())
              ) {
                lastPing = new Date(
                  Math.max(
                    lastPing?.getTime() || 0,
                    new Date(event.createdAt || 0).getTime()
                  )
                )
              }
            }
          )

          return {
            id: category.id,
            name: category.name,
            emoji: category.emoji,
            color: category.color,
            updatedAt: category.updatedAt,
            createdAt: category.createdAt,
            uniqueFieldCount: uniqueFieldNames.size,
            eventsCount: category._count.events,
            lastPing,
          }
        }
      )

      return c.superjson({ categories: categoriesWithCounts })
    } catch (error) {
      console.error("Error in getEventCategories:", error)
      throw new HTTPException(500, {
        message: "Failed to fetch event categories",
      })
    }
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input

      const prisma = await getDb()
      await prisma.eventCategory.delete({
        where: { name_userId: { name, userId: ctx.user.id } },
      })

      return c.json({ success: true })
    }),

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is required")
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
        emoji: z.string().emoji("Invalid emoji").optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { color, name, emoji } = input

      // TODO: ADD PAID PLAN LOGIC

      const prisma = await getDb()
      const eventCategory = await prisma.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ eventCategory })
    }),

  insertQuickstartCategories: privateProcedure.mutation(async ({ ctx, c }) => {
    try {
      const prisma = await getDb()
      const categories = await prisma.eventCategory.createMany({
        data: [
          { name: "bug", emoji: "🐛", color: 0xff6b6b },
          { name: "sale", emoji: "💰", color: 0xffeb3b },
          { name: "question", emoji: "🤔", color: 0x6c5ce7 },
        ].map((category) => ({
          ...category,
          userId: ctx.user.id,
        })),
      })

      return c.json({ success: true, count: categories.count })
    } catch (error) {
      console.error("Error in insertQuickstartCategories:", error)
      throw new HTTPException(500, {
        message: "Failed to create quickstart categories",
      })
    }
  }),

  pollCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input

      const prisma = await getDb()
      const category = await prisma.eventCategory.findUnique({
        where: { name_userId: { name, userId: ctx.user.id } },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      })

      if (!category) {
        throw new HTTPException(404, {
          message: `Category "${name}" not found`,
        })
      }

      const hasEvents = category._count.events > 0

      return c.json({ hasEvents })
    }),

  getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        page: z.number(),
        limit: z.number().max(50),
        timeRange: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, limit, timeRange } = input

      const prisma = await getDb()
      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case "today":
          startDate = startOfDay(now)
          break
        case "week":
          startDate = startOfWeek(now, { weekStartsOn: 0 })
          break
        case "month":
          startDate = startOfMonth(now)
          break
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        prisma.event.findMany({
          where: {
            EventCategory: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.event.count({
          where: {
            EventCategory: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
        }),
        prisma.event
          .findMany({
            where: {
              EventCategory: { name, userId: ctx.user.id },
              createdAt: { gte: startDate },
            },
            select: {
              fields: true,
            },
            distinct: ["fields"],
          })
          .then((events: any[]) => {
            const fieldNames = new Set<string>()
            events.forEach((event: { fields: object }) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                fieldNames.add(fieldName)
              })
            })
            return fieldNames.size
          }),
      ])

      return c.superjson({
        events,
        eventsCount,
        uniqueFieldCount,
      })
    }),

  createAlertThreshold: privateProcedure
    .input(
      z.object({
        categoryName: z.string(),
        name: z.string(),
        condition: z.enum([
          "GREATER_THAN",
          "LESS_THAN",
          "EQUALS",
          "CONTAINS",
          "NOT_CONTAINS",
        ]),
        fieldPath: z.string(),
        threshold: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const prisma = await getDb()
      const category = await prisma.eventCategory.findFirst({
        where: {
          name: input.categoryName,
          userId: ctx.user.id,
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const alertThreshold = await prisma.alertThreshold.create({
        data: {
          name: input.name,
          condition: input.condition,
          fieldPath: input.fieldPath,
          threshold: input.threshold,
          categoryId: category.id,
        },
      })

      return c.json({ alertThreshold })
    }),

  getAlertThresholds: privateProcedure
    .input(z.object({ categoryName: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const prisma = await getDb()
      const category = await prisma.eventCategory.findFirst({
        where: {
          name: input.categoryName,
          userId: ctx.user.id,
        },
        include: {
          alertThresholds: true,
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      return c.json({ alertThresholds: category.alertThresholds })
    }),

  updateAlertThreshold: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        condition: z
          .enum([
            "GREATER_THAN",
            "LESS_THAN",
            "EQUALS",
            "CONTAINS",
            "NOT_CONTAINS",
          ])
          .optional(),
        fieldPath: z.string().optional(),
        threshold: z.string().optional(),
        enabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const prisma = await getDb()
      const threshold = await prisma.alertThreshold.findFirst({
        where: {
          id: input.id,
          category: {
            userId: ctx.user.id,
          },
        },
      })

      if (!threshold) {
        throw new HTTPException(404, { message: "Alert threshold not found" })
      }

      const updatedThreshold = await prisma.alertThreshold.update({
        where: { id: input.id },
        data: {
          name: input.name,
          condition: input.condition,
          fieldPath: input.fieldPath,
          threshold: input.threshold,
          enabled: input.enabled,
        },
      })

      return c.json({ alertThreshold: updatedThreshold })
    }),

  deleteAlertThreshold: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const prisma = await getDb()
      const threshold = await prisma.alertThreshold.findFirst({
        where: {
          id: input.id,
          category: {
            userId: ctx.user.id,
          },
        },
      })

      if (!threshold) {
        throw new HTTPException(404, { message: "Alert threshold not found" })
      }

      await prisma.alertThreshold.delete({
        where: { id: input.id },
      })

      return c.json({ success: true })
    }),

  createEvent: privateProcedure
    .input(
      z.object({
        name: z.string(),
        fields: z.record(z.any()),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const prisma = await getDb()
      const category = await prisma.eventCategory.findFirst({
        where: {
          name: input.name,
          userId: ctx.user.id,
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const formattedMessage = formatEventMessage(input.fields)
      const event = await prisma.event.create({
        data: {
          name: `Event ${new Date().toISOString()}`,
          formattedMessage,
          fields: input.fields,
          userId: ctx.user.id,
          eventCategoryId: category.id,
          createdAt: new Date(), // Add createdAt field
        },
      })

      // Check alert thresholds
      const alerts = await checkThresholds(event, category)

      // Execute incident actions
      const actions = await prisma.incidentAction.findMany({
        where: {
          categoryId: category.id,
          enabled: true,
        },
        orderBy: {
          priority: "asc",
        },
      })

      // Execute actions in parallel
      await Promise.all(
        actions.map((action) => ActionExecutor.execute(action, event))
      )

      return c.json({ event, alerts })
    }),

  getIncidentActions: privateProcedure
    .input(z.object({ categoryName: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { categoryName } = input

      const prisma = await getDb()
      const category = await prisma.eventCategory.findUnique({
        where: {
          name_userId: { name: categoryName, userId: ctx.user.id },
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const actions = await prisma.incidentAction.findMany({
        where: {
          categoryId: category.id,
        },
        orderBy: {
          priority: "asc",
        },
      })

      return c.json({ actions })
    }),

  createIncidentAction: privateProcedure
    .input(
      z.object({
        categoryName: z.string(),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        actionType: z.enum([
          "DISCORD_NOTIFICATION",
          "WEBHOOK",
          "EMAIL",
          "RETRY_CHECK",
          "PAUSE_MONITORING",
        ]),
        conditions: z
          .record(
            z.object({
              operator: z.enum(["equals", "contains", "gt", "lt"]),
              value: z.union([z.string(), z.number()]),
            })
          )
          .optional(),
        config: z.record(z.any()).optional(),
        cooldownMinutes: z.number().min(0).default(0),
        enabled: z.boolean().default(true),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx

      const prisma = await getDb()
      const category = await prisma.eventCategory.findFirst({
        where: {
          name: input.categoryName,
          userId: user.id,
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const action = await prisma.incidentAction.create({
        data: {
          id: nanoid(),
          userId: user.id,
          categoryId: category.id,
          name: input.name,
          description: input.description,
          actionType: input.actionType,
          conditions: input.conditions || {},
          config: input.config || {},
          cooldownMinutes: input.cooldownMinutes,
          enabled: input.enabled,
        },
      })

      return c.json({ action })
    }),

  updateIncidentAction: privateProcedure
    .input(
      z.object({
        categoryName: z.string(),
        id: z.string(),
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { categoryName, id, enabled } = input

      const prisma = await getDb()
      const category = await prisma.eventCategory.findUnique({
        where: {
          name_userId: { name: categoryName, userId: ctx.user.id },
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const action = await prisma.incidentAction.findFirst({
        where: {
          id,
          categoryId: category.id,
        },
      })

      if (!action) {
        throw new HTTPException(404, { message: "Action not found" })
      }

      const updatedAction = await prisma.incidentAction.update({
        where: { id },
        data: { enabled },
      })

      return c.json({ action: updatedAction })
    }),

  deleteIncidentAction: privateProcedure
    .input(
      z.object({
        categoryName: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { categoryName, id } = input

      const prisma = await getDb()
      const category = await prisma.eventCategory.findUnique({
        where: {
          name_userId: { name: categoryName, userId: ctx.user.id },
        },
      })

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      const action = await prisma.incidentAction.findFirst({
        where: {
          id,
          categoryId: category.id,
        },
      })

      if (!action) {
        throw new HTTPException(404, { message: "Action not found" })
      }

      await prisma.incidentAction.delete({
        where: { id },
      })

      return c.json({ success: true })
    }),
})
