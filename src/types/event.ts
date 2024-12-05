/**
 * Represents the possible status values for an event
 */
export enum EventStatus {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  PENDING = "pending"
}

/**
 * Represents the supported field types for event data
 */
export type EventFieldValue = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: EventFieldValue }
  | EventFieldValue[];

/**
 * Represents a monitoring event with its associated metadata and measurements
 */
export interface Event {
  /** Unique identifier for the event */
  id: string;
  /** Name of the event */
  name: string;
  /** Custom fields associated with the event */
  fields: Record<string, EventFieldValue>;
  /** User who owns this event */
  userId: string;
  /** Category this event belongs to */
  categoryId: string;
  /** Current status of the event */
  status: EventStatus;
  /** Optional response time in milliseconds */
  responseTime?: number | null;
  /** Optional duration in milliseconds */
  duration?: number | null;
  /** Optional error message if status is ERROR */
  error?: string | null;
  /** Timestamp when the event was created */
  createdAt: Date;
  /** Timestamp when the event was last updated */
  updatedAt: Date;
}

/**
 * Represents a category for grouping related events
 */
export interface EventCategory {
  /** Unique identifier for the category */
  id: string;
  /** Name of the category */
  name: string;
  /** User who owns this category */
  userId: string;
  /** Timestamp when the category was created */
  createdAt: Date;
  /** Timestamp when the category was last updated */
  updatedAt: Date;
}

/**
 * Type guard to check if a value is a valid EventFieldValue
 */
export function isEventFieldValue(value: unknown): value is EventFieldValue {
  if (value === null) return true;
  
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return true;
    case "object":
      if (Array.isArray(value)) {
        return value.every(isEventFieldValue);
      }
      if (value === null) return true;
      return Object.values(value).every(isEventFieldValue);
    default:
      return false;
  }
}

/**
 * Validates an event object
 * @param event The event to validate
 * @throws Error if the event is invalid
 */
export function validateEvent(event: Event): void {
  if (!event.name || event.name.trim().length === 0) {
    throw new Error("Event name is required");
  }

  if (!Object.values(EventStatus).includes(event.status)) {
    throw new Error(`Invalid event status: ${event.status}`);
  }

  if (event.responseTime !== null && event.responseTime !== undefined && event.responseTime < 0) {
    throw new Error("Response time cannot be negative");
  }

  if (event.duration !== null && event.duration !== undefined && event.duration < 0) {
    throw new Error("Duration cannot be negative");
  }

  // Validate all fields are of correct type
  for (const [key, value] of Object.entries(event.fields)) {
    if (!isEventFieldValue(value)) {
      throw new Error(`Invalid field value for ${key}`);
    }
  }
}

/**
 * Creates a new Event with default values
 */
export function createEvent(params: Partial<Event>): Event {
  const now = new Date();
  return {
    id: params.id ?? crypto.randomUUID(),
    name: params.name ?? "",
    fields: params.fields ?? {},
    userId: params.userId ?? "",
    categoryId: params.categoryId ?? "",
    status: params.status ?? EventStatus.PENDING,
    responseTime: params.responseTime ?? null,
    duration: params.duration ?? null,
    error: params.error ?? null,
    createdAt: params.createdAt ?? now,
    updatedAt: params.updatedAt ?? now
  };
}
