"use client"

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth, useUser } from "@clerk/nextjs"
import { z } from "zod"

// Feature flag type validation schema
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

interface FeatureFlagContextType {
  flags: FeatureFlag[]
  isLoading: boolean
  error: Error | null
  checkFlag: (key: string) => boolean
  checkFlagValue: <T>(key: string, defaultValue: T) => T
  getFlagDetails: (key: string) => FeatureFlag | null
  isEnabled: (key: string) => boolean
  refreshFlags: () => Promise<void>
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  flags: [],
  isLoading: false,
  error: null,
  checkFlag: () => false,
  checkFlagValue: (_, defaultValue) => defaultValue,
  getFlagDetails: () => null,
  isEnabled: () => false,
  refreshFlags: async () => {},
})

interface FeatureFlagProviderProps {
  children: ReactNode
  environment?: string
  defaultFlags?: FeatureFlag[]
  cacheTime?: number
  retryCount?: number
}

export function FeatureFlagProvider({
  children,
  environment = "development",
  defaultFlags = [],
  cacheTime = 5 * 60 * 1000, // 5 minutes
  retryCount = 3,
}: FeatureFlagProviderProps) {
  const { userId } = useAuth()
  const { user } = useUser()

  const {
    data: flags = defaultFlags,
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
        return defaultFlags
      }
    },
    retry: retryCount,
    staleTime: cacheTime / 2,
  })

  const refreshFlags = useCallback(async () => {
    await refetch()
  }, [refetch])

  const checkConditions = useCallback(
    (flag: FeatureFlag): boolean => {
      if (!flag.conditions?.length) return true

      return flag.conditions.every((condition) => {
        switch (condition.type) {
          case "user":
            return condition.operator === "equals"
              ? userId === condition.value
              : userId !== condition.value

          case "group":
            // Get groups from user's organization memberships and roles
            const userGroups =
              user?.organizationMemberships?.map((m) => m.organization.id) || []
            const userRoles = (user?.publicMetadata?.roles as string[]) || []
            const allGroups = [...userGroups, ...userRoles]

            return condition.operator === "contains"
              ? allGroups.includes(condition.value)
              : !allGroups.includes(condition.value)

          case "date":
            const now = new Date()
            const date = new Date(condition.value)
            return condition.operator === "before" ? now < date : now > date

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
    },
    [userId, user]
  )

  const checkGradualRollout = useCallback(
    (flag: FeatureFlag): boolean => {
      if (!flag.rolloutConfig?.startDate) return true

      const now = new Date()
      const start = new Date(flag.rolloutConfig.startDate)
      const end = flag.rolloutConfig.endDate
        ? new Date(flag.rolloutConfig.endDate)
        : null

      if (now < start) return false
      if (end && now > end) return true

      const daysSinceStart = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
      const increment = flag.rolloutConfig.incrementPerDay || 10
      const currentPercentage = Math.min(daysSinceStart * increment, 100)

      if (!userId) return false
      const hash = hashCode(userId + flag.key)
      const userPercentile = ((hash % 100) + 100) % 100

      return userPercentile < currentPercentage
    },
    [userId]
  )

  const checkFlag = useCallback(
    (key: string): boolean => {
      const flag = flags.find((f) => f.key === key)

      if (!flag || flag.isArchived) return false
      if (flag.expiresAt && new Date(flag.expiresAt) < new Date()) return false
      if (!checkConditions(flag)) return false

      switch (flag.type) {
        case "boolean":
          return !!flag.value

        case "percentage":
          if (!userId) return false
          const hash = hashCode(userId + key)
          const percentage = ((hash % 100) + 100) % 100
          return percentage < (flag.value?.percentage || 0)

        case "userlist":
          if (!userId) return false
          return flag.value?.users?.includes(userId) || false

        case "schedule":
          const now = new Date()
          const start = flag.value?.startDate
            ? new Date(flag.value.startDate)
            : null
          const end = flag.value?.endDate ? new Date(flag.value.endDate) : null
          return (!start || now >= start) && (!end || now <= end)

        case "gradual":
          return checkGradualRollout(flag)

        default:
          return false
      }
    },
    [flags, userId, checkConditions, checkGradualRollout]
  )

  const checkFlagValue = useCallback(
    <T,>(key: string, defaultValue: T): T => {
      const flag = flags.find((f) => f.key === key)
      if (!flag || !checkFlag(key)) return defaultValue
      return (flag.value as T) ?? defaultValue
    },
    [flags, checkFlag]
  )

  const getFlagDetails = useCallback(
    (key: string): FeatureFlag | null => {
      return flags.find((f) => f.key === key) || null
    },
    [flags]
  )

  const isEnabled = useCallback(
    (key: string): boolean => {
      return checkFlag(key)
    },
    [checkFlag]
  )

  const contextValue = useMemo(
    () => ({
      flags,
      isLoading,
      error,
      checkFlag,
      checkFlagValue,
      getFlagDetails,
      isEnabled,
      refreshFlags,
    }),
    [
      flags,
      isLoading,
      error,
      checkFlag,
      checkFlagValue,
      getFlagDetails,
      isEnabled,
      refreshFlags,
    ]
  )

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext)
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider")
  }
  return context
}

// MurmurHash3 for better distribution
function hashCode(str: string): number {
  let h1 = 0xdeadbeef
  const c1 = 0xcc9e2d51
  const c2 = 0x1b873593

  for (let i = 0; i < str.length; i++) {
    let k1 = str.charCodeAt(i)
    k1 =
      ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
    k1 = (k1 << 15) | (k1 >>> 17)
    k1 =
      ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff
    h1 ^= k1
    h1 = (h1 << 13) | (h1 >>> 19)
    h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff
  }

  h1 ^= str.length
  h1 ^= h1 >>> 16
  h1 =
    ((h1 & 0xffff) * 0x85ebca6b +
      ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
    0xffffffff
  h1 ^= h1 >>> 13
  h1 =
    ((h1 & 0xffff) * 0xc2b2ae35 +
      ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
    0xffffffff
  h1 ^= h1 >>> 16

  return Math.abs(h1)
}
