/**
 * Interface defining the structure of subscription quotas
 */
interface SubscriptionQuota {
  /** Maximum number of events allowed per month */
  maxEventsPerMonth: number
  /** Maximum number of SLAs that can be defined */
  maxSLAs: number
  /** Maximum number of event categories that can be created */
  maxEventCategories: number
}

/**
 * Quota limits for free tier users.
 * These users have access to basic monitoring capabilities
 * with limited events, SLAs, and categories.
 */
export const FREE_QUOTA: SubscriptionQuota = {
  maxEventsPerMonth: 1000,
  maxSLAs: 1,
  maxEventCategories: 3,
} as const

/**
 * Quota limits for pro tier users.
 * These users have access to extended monitoring capabilities
 * with higher limits for events, SLAs, and categories.
 */
export const PRO_QUOTA: SubscriptionQuota = {
  maxEventsPerMonth: 100000,
  maxSLAs: 5,
  maxEventCategories: 10,
} as const

/**
 * Validates if the given quota values are within acceptable ranges
 * @param quota The quota configuration to validate
 * @throws Error if any quota values are invalid
 */
export function validateQuota(quota: SubscriptionQuota): void {
  if (quota.maxEventsPerMonth <= 0) {
    throw new Error("maxEventsPerMonth must be greater than 0")
  }
  if (quota.maxSLAs <= 0) {
    throw new Error("maxSLAs must be greater than 0")
  }
  if (quota.maxEventCategories <= 0) {
    throw new Error("maxEventCategories must be greater than 0")
  }
}

// Validate quotas at startup
validateQuota(FREE_QUOTA)
validateQuota(PRO_QUOTA)
