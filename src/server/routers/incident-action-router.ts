import { db } from "@/db";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { z } from "zod";
import { nanoid } from "nanoid";

const actionTypeEnum = z.enum(["DISCORD_NOTIFICATION", "WEBHOOK", "EMAIL", "RETRY_CHECK", "PAUSE_MONITORING"]);

const conditionSchema = z.record(z.object({
  operator: z.enum(["equals", "contains", "gt", "lt"]),
  value: z.union([z.string(), z.number()]),
}));

const configSchema = z.record(z.any());

export const incidentActionRouter = router({
  create: privateProcedure
    .input(z.object({
      categoryId: z.string(),
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      actionType: actionTypeEnum,
      conditions: conditionSchema.optional(),
      config: configSchema.optional(),
      cooldownMinutes: z.number().min(0).default(0),
      enabled: z.boolean().default(true),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;

      const action = await db.incidentAction.create({
        data: {
          id: nanoid(),
          userId: user.id,
          categoryId: input.categoryId,
          name: input.name,
          description: input.description,
          actionType: input.actionType,
          conditions: input.conditions || {},
          config: input.config || {},
          cooldownMinutes: input.cooldownMinutes,
          enabled: input.enabled,
        },
      });

      return c.json(action);
    }),

  update: privateProcedure
    .input(z.object({
      id: z.string(),
      categoryId: z.string().optional(),
      name: z.string().min(1, "Name is required").optional(),
      description: z.string().optional(),
      actionType: actionTypeEnum.optional(),
      conditions: conditionSchema.optional(),
      config: configSchema.optional(),
      cooldownMinutes: z.number().min(0).optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { id, ...data } = input;

      const action = await db.incidentAction.update({
        where: {
          id,
          userId: user.id,
        },
        data,
      });

      return c.json(action);
    }),

  delete: privateProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;

      await db.incidentAction.delete({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      return c.json({ success: true });
    }),

  list: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    const actions = await db.incidentAction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(actions);
  }),

  get: privateProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;

      const action = await db.incidentAction.findFirst({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      return c.json(action);
    }),

  getLogs: privateProcedure
    .input(z.object({
      actionId: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;

      const logs = await db.incidentActionLog.findMany({
        where: {
          action: {
            id: input.actionId,
            userId: user.id,
          },
        },
        orderBy: {
          startedAt: "desc",
        },
      });

      return c.json(logs);
    }),
});
