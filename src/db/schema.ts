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
