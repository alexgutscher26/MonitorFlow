import { Plan } from "@prisma/client";

export interface SLADefinition {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  target: number;
  timeWindow: string;
  warningThreshold: number | null;
  criticalThreshold: number | null;
  enableNotifications: boolean;
  emailNotifications: boolean;
  webhookNotifications: boolean;
  webhookUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  measurements: SLAMeasurement[];
  EventCategory: EventCategory | null;
  eventCategoryId: string | null;
}

export interface EventCategory {
  id: string;
  name: string;
  color: number;
  emoji: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SLAMeasurement {
  id: string;
  slaDefinitionId: string;
  startTime: Date;
  endTime: Date;
  uptimePercent: number;
  downtimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SLANotification {
  id: string;
  slaDefinitionId: string;
  type: "WARNING" | "CRITICAL" | "RECOVERY";
  message: string;
  status: "PENDING" | "DELIVERED" | "FAILED";
  error: string | null;
  createdAt: Date;
  deliveredAt: Date | null;
}

export type TimeRange = "7d" | "30d" | "90d" | "all";

export const timeRanges: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "all": "All time",
};

export interface ThresholdFormValues {
  warningThreshold: number;
  criticalThreshold: number;
  enableNotifications: boolean;
  emailNotifications: boolean;
  webhookNotifications: boolean;
  webhookUrl: string;
}

export interface SLACardProps {
  sla: SLADefinition;
}

export interface SLAStatusIndicatorProps {
  currentUptime: number;
  target: number;
  className?: string;
}

export interface SLATrendGraphProps {
  measurements: SLAMeasurement[];
  target: number;
  title?: string;
}

export interface SLAThresholdConfigProps {
  slaId: string;
  target: number;
  initialThresholds?: {
    warningThreshold: number;
    criticalThreshold: number;
    enableNotifications: boolean;
    emailNotifications: boolean;
    webhookNotifications: boolean;
    webhookUrl?: string;
  };
}

export interface NotificationHistoryProps {
  slaId: string;
}

export interface CreateSLADialogProps {
  categories: {
    id: string;
    name: string;
  }[];
  user: {
    plan: Plan;
  };
  currentSLACount: number;
}

export interface DeleteSLADialogProps {
  slaId: string;
  slaName: string;
}

export interface ExportSLAButtonProps {
  slas: SLADefinition[];
}

export interface ImportSLAButtonProps {
  onImportComplete?: () => void;
}
