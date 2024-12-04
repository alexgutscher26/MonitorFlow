// 👇 constant value in all uppercase
export const FREE_QUOTA = {
  maxEventsPerMonth: 1000,
  maxSLAs: 1,
  maxEventCategories: 3,
} as const

export const PRO_QUOTA = {
  maxEventsPerMonth: 100000,
  maxSLAs: 5,
  maxEventCategories: 10,
} as const
