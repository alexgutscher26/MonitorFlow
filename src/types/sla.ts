import { Plan } from "@prisma/client"

/**
 * Represents the notification type for SLA status changes
 */
export enum NotificationType {
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
  RECOVERY = "RECOVERY",
}

/**
 * Represents the delivery status of an SLA notification
 */
export enum NotificationStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

/**
 * Time range options for SLA measurements
 */
export type TimeRange = "7d" | "30d" | "90d" | "all"

/**
 * Human-readable labels for time ranges
 */
export const timeRanges: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
} as const

/**
 * Represents a category for grouping related events
 */
export interface EventCategory {
  id: string
  name: string
  color: number
  emoji: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Represents a single SLA measurement within a time window
 */
export interface SLAMeasurement {
  id: string
  slaDefinitionId: string
  startTime: Date
  endTime: Date
  uptimePercent: number
  downtimeMinutes: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Core SLA definition interface containing all configuration parameters
 */
export interface SLADefinition {
  id: string
  userId: string
  name: string
  description: string | null
  /** Target uptime percentage (0-100) */
  target: number
  /** Time window for SLA calculation (e.g., "24h", "7d") */
  timeWindow: string
  /** Warning threshold percentage (0-100) */
  warningThreshold: number | null
  /** Critical threshold percentage (0-100) */
  criticalThreshold: number | null
  enableNotifications: boolean
  emailNotifications: boolean
  webhookNotifications: boolean
  webhookUrl: string | null
  createdAt: Date
  updatedAt: Date
  measurements: SLAMeasurement[]
  EventCategory: EventCategory | null
  eventCategoryId: string | null
}

/**
 * Represents an SLA notification event
 */
export interface SLANotification {
  id: string
  slaDefinitionId: string
  type: NotificationType
  message: string
  status: NotificationStatus
  error: string | null
  createdAt: Date
  deliveredAt: Date | null
}

/**
 * Form values for configuring SLA thresholds and notifications
 */
export interface ThresholdFormValues {
  /** Warning threshold percentage (0-100) */
  warningThreshold: number
  /** Critical threshold percentage (0-100) */
  criticalThreshold: number
  enableNotifications: boolean
  emailNotifications: boolean
  webhookNotifications: boolean
  webhookUrl: string
}

// UI Component Props Interfaces

export interface SLACardProps {
  sla: SLADefinition
}

export interface SLAStatusIndicatorProps {
  /** Current uptime percentage (0-100) */
  currentUptime: number
  /** Target uptime percentage (0-100) */
  target: number
  className?: string
}

export interface SLATrendGraphProps {
  measurements: SLAMeasurement[]
  /** Target uptime percentage (0-100) */
  target: number
  title?: string
}

export interface SLAThresholdConfigProps {
  slaId: string
  /** Target uptime percentage (0-100) */
  target: number
  initialThresholds?: {
    warningThreshold: number
    criticalThreshold: number
    enableNotifications: boolean
    emailNotifications: boolean
    webhookNotifications: boolean
    webhookUrl?: string
  }
}

export interface NotificationHistoryProps {
  slaId: string
}

export interface CreateSLADialogProps {
  categories: Array<{
    id: string
    name: string
  }>
  user: {
    plan: Plan
  }
  currentSLACount: number
}

export interface DeleteSLADialogProps {
  slaId: string
  slaName: string
}

export interface ExportSLAButtonProps {
  slas: SLADefinition[]
}

export interface ImportSLAButtonProps {
  onImportComplete?: () => void
}

/**
 * Validates SLA threshold values
 * @param threshold The threshold value to validate
 * @returns True if the threshold is valid
 */
export function isValidThreshold(threshold: number): boolean {
  return threshold >= 0 && threshold <= 100
}

/**
 * Validates a complete SLA definition
 * @param sla The SLA definition to validate
 * @throws Error if the SLA definition is invalid
 */
export function validateSLADefinition(sla: SLADefinition): void {
  if (!isValidThreshold(sla.target)) {
    throw new Error("Target must be between 0 and 100")
  }
  if (
    sla.warningThreshold !== null &&
    !isValidThreshold(sla.warningThreshold)
  ) {
    throw new Error("Warning threshold must be between 0 and 100")
  }
  if (
    sla.criticalThreshold !== null &&
    !isValidThreshold(sla.criticalThreshold)
  ) {
    throw new Error("Critical threshold must be between 0 and 100")
  }
  if (sla.webhookNotifications && !sla.webhookUrl) {
    throw new Error(
      "Webhook URL is required when webhook notifications are enabled"
    )
  }
}
