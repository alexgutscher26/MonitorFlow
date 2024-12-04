import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

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
});

export const measurements = mysqlTable("measurements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  slaId: varchar("sla_id", { length: 255 }).notNull(),
  uptimePercent: decimal("uptime_percent", { precision: 5, scale: 2 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const measurementsRelations = relations(measurements, ({ one }) => ({
  sla: one(sla, {
    fields: [measurements.slaId],
    references: [sla.id],
  }),
}));

export const slaRelations = relations(sla, ({ many }) => ({
  measurements: many(measurements),
}));

export const incidentAction = mysqlTable("incident_action", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  categoryId: varchar("category_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(true),
  actionType: mysqlEnum("action_type", ["DISCORD_NOTIFICATION", "WEBHOOK", "EMAIL", "RETRY_CHECK", "PAUSE_MONITORING"]).notNull(),
  conditions: json("conditions").$type<Record<string, { operator: "equals" | "contains" | "gt" | "lt"; value: string | number }>>(),
  config: json("config").$type<Record<string, any>>(),
  cooldownMinutes: int("cooldown_minutes").default(0),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const incidentActionLog = mysqlTable("incident_action_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  actionId: varchar("action_id", { length: 255 }).notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["IN_PROGRESS", "COMPLETED", "FAILED"]).notNull(),
  result: text("result"),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const incidentActionRelations = relations(incidentAction, ({ many }) => ({
  logs: many(incidentActionLog),
}));

export const incidentActionLogRelations = relations(incidentActionLog, ({ one }) => ({
  action: one(incidentAction, {
    fields: [incidentActionLog.actionId],
    references: [incidentAction.id],
  }),
}));
