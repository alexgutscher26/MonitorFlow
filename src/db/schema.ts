<<<<<<< HEAD
import { relations } from "drizzle-orm"
=======
import { relations, sql } from "drizzle-orm"
>>>>>>> main
import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"
<<<<<<< HEAD

export const sla = mysqlTable("sla", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  target: decimal("target", { precision: 5, scale: 2 }).notNull(),
  timeWindow: varchar("time_window", { length: 50 }).notNull(),
  category: json("category").$type<{ name: string; emoji?: string }>(),
  warningThreshold: decimal("warning_threshold", { precision: 5, scale: 2 }),
  criticalThreshold: decimal("critical_threshold", { precision: 5, scale: 2 }),
  enableNotifications: boolean("enable_notifications").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  webhookNotifications: boolean("webhook_notifications").default(false),
  webhookUrl: text("webhook_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
})

export const measurements = mysqlTable("measurements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  slaId: varchar("sla_id", { length: 255 }).notNull(),
  uptimePercent: decimal("uptime_percent", {
    precision: 5,
    scale: 2,
  }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
=======
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

// Common types
type TimeWindow = "1h" | "24h" | "7d" | "30d" | "90d"

// SLA table and types
export const slaStatusEnum = mysqlEnum("status", [
  "active",
  "paused",
  "maintenance",
  "archived",
])
>>>>>>> main

export const sla = mysqlTable(
  "sla",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    target: decimal("target", { precision: 5, scale: 2 }).notNull(),
    timeWindow: varchar("time_window", { length: 50 })
      .$type<TimeWindow>()
      .notNull(),
    category: json("category").$type<{
      name: string
      emoji?: string
      color?: string
    }>(),
    warningThreshold: decimal("warning_threshold", {
      precision: 5,
      scale: 2,
    }),
    criticalThreshold: decimal("critical_threshold", {
      precision: 5,
      scale: 2,
    }),
    status: slaStatusEnum.notNull().default("active"),
    enableNotifications: boolean("enable_notifications").default(true),
    emailNotifications: boolean("email_notifications").default(true),
    webhookNotifications: boolean("webhook_notifications").default(false),
    webhookUrl: text("webhook_url"),
    notificationConfig: json("notification_config").$type<{
      channels?: string[]
      throttle?: number
      customTemplate?: string
    }>(),
    maintenanceWindows: json("maintenance_windows").$type<
      Array<{
        start: string
        end: string
        recurring?: boolean
        frequency?: "daily" | "weekly" | "monthly"
      }>
    >(),
    tags: json("tags").$type<string[]>(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    version: int("version").notNull().default(1),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    nameIdx: index("name_idx").on(table.name),
    statusIdx: index("status_idx").on(table.status),
    categoryIdx: index("category_idx").on(table.category),
    timeWindowIdx: index("time_window_idx").on(table.timeWindow),
  })
)

// Measurements table and types
export const measurements = mysqlTable(
  "measurements",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    slaId: varchar("sla_id", { length: 255 }).notNull(),
    uptimePercent: decimal("uptime_percent", {
      precision: 5,
      scale: 2,
    }).notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    totalChecks: int("total_checks").notNull(),
    successfulChecks: int("successful_checks").notNull(),
    degradedChecks: int("degraded_checks").notNull().default(0),
    failedChecks: int("failed_checks").notNull().default(0),
    averageResponseTime: int("average_response_time"),
    p95ResponseTime: int("p95_response_time"),
    p99ResponseTime: int("p99_response_time"),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    slaIdIdx: index("sla_id_idx").on(table.slaId),
    timeRangeIdx: index("time_range_idx").on(table.startTime, table.endTime),
    uptimeIdx: index("uptime_idx").on(table.uptimePercent),
  })
)

// Incident action types
export type ActionCondition = {
  field: string
  operator: "equals" | "contains" | "gt" | "lt" | "between"
  value: string | number | [number, number]
  type?: "string" | "number" | "boolean"
}

export type ActionConfig = {
  webhook?: {
    url: string
    method: "GET" | "POST" | "PUT"
    headers?: Record<string, string>
    body?: string
  }
  email?: {
    to: string[]
    cc?: string[]
    bcc?: string[]
    template?: string
  }
  discord?: {
    webhookUrl: string
    message?: string
    embed?: boolean
  }
  retry?: {
    maxAttempts: number
    delayMs: number
  }
  pause?: {
    durationMinutes: number
  }
}

// Incident action table
export const incidentAction = mysqlTable(
  "incident_action",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    categoryId: varchar("category_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    enabled: boolean("enabled").default(true),
    priority: int("priority").default(0),
    actionType: mysqlEnum("action_type", [
      "DISCORD_NOTIFICATION",
      "WEBHOOK",
      "EMAIL",
      "RETRY_CHECK",
      "PAUSE_MONITORING",
      "CUSTOM_SCRIPT",
    ]).notNull(),
    conditions: json("conditions").$type<ActionCondition[]>(),
    config: json("config").$type<ActionConfig>(),
    cooldownMinutes: int("cooldown_minutes").default(0),
    maxRetries: int("max_retries").default(3),
    lastTriggered: timestamp("last_triggered"),
    tags: json("tags").$type<string[]>(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    version: int("version").notNull().default(1),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    categoryIdIdx: index("category_id_idx").on(table.categoryId),
    nameIdx: index("name_idx").on(table.name),
    actionTypeIdx: index("action_type_idx").on(table.actionType),
    enabledIdx: index("enabled_idx").on(table.enabled),
    priorityIdx: index("priority_idx").on(table.priority),
  })
)

// Incident action log table
export const incidentActionLog = mysqlTable(
  "incident_action_log",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    actionId: varchar("action_id", { length: 255 }).notNull(),
    eventId: varchar("event_id", { length: 255 }).notNull(),
    status: mysqlEnum("status", [
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
      "FAILED",
      "CANCELLED",
    ]).notNull(),
    result: text("result"),
    error: text("error"),
    retryCount: int("retry_count").default(0),
    duration: int("duration_ms"),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    startedAt: timestamp("started_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    actionIdIdx: index("action_id_idx").on(table.actionId),
    eventIdIdx: index("event_id_idx").on(table.eventId),
    statusIdx: index("status_idx").on(table.status),
    timeIdx: index("time_idx").on(table.startedAt, table.completedAt),
  })
)

// Relations
export const measurementsRelations = relations(measurements, ({ one }) => ({
  sla: one(sla, {
    fields: [measurements.slaId],
    references: [sla.id],
  }),
}))

export const slaRelations = relations(sla, ({ many }) => ({
  measurements: many(measurements),
}))

<<<<<<< HEAD
export const incidentAction = mysqlTable("incident_action", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  categoryId: varchar("category_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(true),
  actionType: mysqlEnum("action_type", [
    "DISCORD_NOTIFICATION",
    "WEBHOOK",
    "EMAIL",
    "RETRY_CHECK",
    "PAUSE_MONITORING",
  ]).notNull(),
  conditions: json("conditions").$type<
    Record<
      string,
      {
        operator: "equals" | "contains" | "gt" | "lt"
        value: string | number
      }
    >
  >(),
  config: json("config").$type<Record<string, any>>(),
  cooldownMinutes: int("cooldown_minutes").default(0),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
})

export const incidentActionLog = mysqlTable("incident_action_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  actionId: varchar("action_id", { length: 255 }).notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["IN_PROGRESS", "COMPLETED", "FAILED"]).notNull(),
  result: text("result"),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
})

export const incidentActionRelations = relations(
  incidentAction,
  ({ many }) => ({
    logs: many(incidentActionLog),
  })
)

export const incidentActionLogRelations = relations(
  incidentActionLog,
  ({ one }) => ({
    action: one(incidentAction, {
      fields: [incidentActionLog.actionId],
      references: [incidentAction.id],
    }),
  })
)
=======
export const incidentActionRelations = relations(
  incidentAction,
  ({ many }) => ({
    logs: many(incidentActionLog),
  })
)

export const incidentActionLogRelations = relations(
  incidentActionLog,
  ({ one }) => ({
    action: one(incidentAction, {
      fields: [incidentActionLog.actionId],
      references: [incidentAction.id],
    }),
  })
)

// Zod schemas for validation
export const insertSLASchema = createInsertSchema(sla, {
  name: z.string().min(1).max(255),
  target: z.number().min(0).max(100),
  timeWindow: z.enum(["1h", "24h", "7d", "30d", "90d"]),
  warningThreshold: z.number().min(0).max(100).optional(),
  criticalThreshold: z.number().min(0).max(100).optional(),
  webhookUrl: z.string().url().optional(),
})

export const insertMeasurementSchema = createInsertSchema(measurements, {
  uptimePercent: z.number().min(0).max(100),
  totalChecks: z.number().min(0),
  successfulChecks: z.number().min(0),
})

export const insertIncidentActionSchema = createInsertSchema(incidentAction, {
  name: z.string().min(1).max(255),
  priority: z.number().min(0).max(100).optional(),
  cooldownMinutes: z.number().min(0).optional(),
  maxRetries: z.number().min(0).max(10).optional(),
})
>>>>>>> main
