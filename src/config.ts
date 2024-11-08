// 👇 constant value in all uppercase
export const FREE_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventCategories: 3,
} as const

export const PRO_QUOTA = {
  maxEventsPerMonth: 10000,
  maxEventCategories: 20,
} as const
