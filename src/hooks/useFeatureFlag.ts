import { useQuery } from "@tanstack/react-query"
import { useAuth, useUser } from "@clerk/nextjs"
import { useMemo } from "react"
import { z } from "zod"

// Strongly typed feature flag schema
const featureFlagSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["boolean", "percentage", "userlist", "schedule", "gradual"]),
  value: z.any(),
  environment: z.string(),
  expiresAt: z.string().datetime().optional(),
  isArchived: z.boolean(),
  conditions: z
    .array(
      z.object({
        type: z.enum(["user", "group", "date", "time", "location"]),
        operator: z.enum([
          "equals",
          "notEquals",
          "contains",
          "notContains",
          "before",
          "after",
        ]),
        value: z.any(),
      })
    )
    .optional(),
  rolloutConfig: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      incrementPerDay: z.number().min(0).max(100).optional(),
    })
    .optional(),
})

type FeatureFlag = z.infer<typeof featureFlagSchema>

interface UseFeatureFlagOptions {
  environment?: string
  defaultValue?: boolean
  cacheTime?: number
}

interface UseFeatureFlagResult {
  isEnabled: boolean
  isLoading: boolean
  error: Error | null
  flag: FeatureFlag | null
  refetch: () => Promise<void>
}

// MurmurHash3 for better distribution
function murmurhash3(key: string): number {
  let h1 = 0x12345678
  const c1 = 0xcc9e2d51
  const c2 = 0x1b873593
  const len = key.length
  let k1: number

  for (let i = 0; i < len - 3; i += 4) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(i + 1) & 0xff) << 8) |
      ((key.charCodeAt(i + 2) & 0xff) << 16) |
      ((key.charCodeAt(i + 3) & 0xff) << 24)

    k1 = Math.imul(k1, c1)
    k1 = (k1 << 15) | (k1 >>> 17)
    k1 = Math.imul(k1, c2)

    h1 ^= k1
    h1 = (h1 << 13) | (h1 >>> 19)
    h1 = Math.imul(h1, 5) + 0xe6546b64
  }

  k1 = 0
  switch (len % 4) {
    case 3:
      k1 ^= (key.charCodeAt(len - 3) & 0xff) << 16
      break
    case 2:
      k1 ^= (key.charCodeAt(len - 2) & 0xff) << 8
      break
    case 1:
      k1 ^= key.charCodeAt(len - 1) & 0xff
      k1 = Math.imul(k1, c1)
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = Math.imul(k1, c2)
      h1 ^= k1
      break
  }

  h1 ^= len
  h1 ^= h1 >>> 16
  h1 = Math.imul(h1, 0x85ebca6b)
  h1 ^= h1 >>> 13
  h1 = Math.imul(h1, 0xc2b2ae35)
  h1 ^= h1 >>> 16

  return Math.abs(h1)
}

export function useFeatureFlag(
  key: string,
  {
    environment = "development",
    defaultValue = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  }: UseFeatureFlagOptions = {}
): UseFeatureFlagResult {
  const { userId } = useAuth()
  const { user } = useUser()

  const {
    data: flags,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["featureFlags", environment],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/feature-flags?environment=${environment}`
        )
        if (!response.ok) {
          throw new Error(
            `Failed to fetch feature flags: ${response.statusText}`
          )
        }
        const data = await response.json()
        return z.array(featureFlagSchema).parse(data)
      } catch (error) {
        console.error("Error fetching feature flags:", error)
        throw error
      }
    },
    staleTime: cacheTime / 2,
    retry: 3,
  })

  const flag = useMemo(
    () => flags?.find((f) => f.key === key) ?? null,
    [flags, key]
  )

  const isEnabled = useMemo(() => {
    if (!flag || flag.isArchived) {
      return defaultValue
    }

    // Handle expired flags
    if (flag.expiresAt && new Date(flag.expiresAt) < new Date()) {
      return defaultValue
    }

    // Check conditions if present
    if (flag.conditions?.length) {
      const allConditionsMet = flag.conditions.every((condition) => {
        switch (condition.type) {
          case "user":
            return condition.operator === "equals"
              ? userId === condition.value
              : userId !== condition.value

          case "group": {
            const userGroups =
              user?.organizationMemberships?.map((m) => m.organization.id) || []
            const userRoles = (user?.publicMetadata?.roles as string[]) || []
            const allGroups = [...userGroups, ...userRoles]

            return condition.operator === "contains"
              ? allGroups.includes(condition.value)
              : !allGroups.includes(condition.value)
          }

          case "date": {
            const now = new Date()
            const date = new Date(condition.value)
            return condition.operator === "before" ? now < date : now > date
          }

          case "time": {
            const now = new Date()
            const [hours, minutes] = (condition.value as string)
              .split(":")
              .map(Number)
            const time = new Date()
            time.setHours(hours, minutes)
            return condition.operator === "before" ? now < time : now > time
          }

          default:
            return false
        }
      })

      if (!allConditionsMet) {
        return defaultValue
      }
    }

    // Handle different flag types
    switch (flag.type) {
      case "boolean":
        return !!flag.value

      case "percentage":
        if (!userId) return defaultValue
        const hash = murmurhash3(userId + key)
        const percentage = ((hash % 100) + 100) % 100
        return percentage < (flag.value?.percentage || 0)

      case "userlist":
        if (!userId) return defaultValue
        return flag.value?.users?.includes(userId) || defaultValue

      case "schedule": {
        const now = new Date()
        const start = flag.value?.startDate
          ? new Date(flag.value.startDate)
          : null
        const end = flag.value?.endDate ? new Date(flag.value.endDate) : null
        return (!start || now >= start) && (!end || now <= end)
      }

      case "gradual": {
        if (!flag.rolloutConfig?.startDate || !userId) return defaultValue

        const now = new Date()
        const start = new Date(flag.rolloutConfig.startDate)
        const end = flag.rolloutConfig.endDate
          ? new Date(flag.rolloutConfig.endDate)
          : null

        if (now < start) return defaultValue
        if (end && now > end) return true

        const daysSinceStart = Math.floor(
          (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
        const increment = flag.rolloutConfig.incrementPerDay || 10
        const currentPercentage = Math.min(daysSinceStart * increment, 100)

        const hash = murmurhash3(userId + key)
        const userPercentile = ((hash % 100) + 100) % 100

        return userPercentile < currentPercentage
      }

      default:
        return defaultValue
    }
  }, [flag, userId, user, key, defaultValue])

  return {
    isEnabled,
    isLoading,
    error: error as Error | null,
    flag,
    refetch: refetch as unknown as () => Promise<void>,
  }
}
