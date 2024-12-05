"use client"

import { createContext, useContext, ReactNode } from "react"
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

interface FeatureFlagContextType {
  flags: FeatureFlag[]
  isLoading: boolean
  error: Error | null
  checkFlag: (key: string) => boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  flags: [],
  isLoading: false,
  error: null,
  checkFlag: () => false,
})

export function FeatureFlagProvider({
  children,
  environment = "development",
}: {
  children: ReactNode
  environment?: string
}) {
  const { userId } = useAuth()

  const {
    data: flags = [],
    isLoading,
    error,
  } = useQuery({
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

  const checkFlag = (key: string): boolean => {
    const flag = flags.find((f) => f.key === key)

    if (!flag || flag.isArchived) {
      return false
    }

    // Check if flag has expired
    if (flag.expiresAt && new Date(flag.expiresAt) < new Date()) {
      return false
    }

    // Handle different flag types
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

      default:
        return false
    }
  }

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, error, checkFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext)
}

// Simple hash function for consistent percentage rollouts
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}
