import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"

interface FeatureFlag {
  id: string
  key: string
  name: string
  description?: string
  type: string
  value: any
  environment: string
  expiresAt?: string
  isArchived: boolean
}

export function useFeatureFlag(key: string, environment = "development") {
  const { userId } = useAuth()

  const { data: flags } = useQuery({
    queryKey: ["featureFlags", environment],
    queryFn: async () => {
      const response = await fetch(
        `/api/feature-flags?environment=${environment}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch feature flags")
      }
      return response.json() as Promise<FeatureFlag[]>
    },
  })

  const flag = flags?.find((f) => f.key === key)

  if (!flag || flag.isArchived) {
    return false
  }

  // Handle expired flags
  if (flag.expiresAt && new Date(flag.expiresAt) < new Date()) {
    return false
  }

  // Handle different flag types
  switch (flag.type) {
    case "boolean":
      return !!flag.value

    case "percentage":
      if (!userId) return false
      // Create a consistent hash for the user ID + flag key
      const hash = hashCode(userId + key)
      const percentage = ((hash % 100) + 100) % 100 // Ensure positive 0-99
      return percentage < (flag.value?.percentage || 0)

    case "userlist":
      if (!userId) return false
      return flag.value?.users?.includes(userId) || false

    default:
      return false
  }
}

// Simple hash function for consistent percentage rollouts
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}
