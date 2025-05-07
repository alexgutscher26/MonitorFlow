"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Plan } from "@prisma/client"

type BrandingSettings = {
  logo: string | null
  primaryColor: string | null
  secondaryColor: string | null
}

type BrandingContextType = {
  branding: BrandingSettings
  isLoading: boolean
  isPro: boolean
}

const defaultBranding: BrandingSettings = {
  logo: null,
  primaryColor: null,
  secondaryColor: null
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  isLoading: true,
  isPro: false
})

export const useBranding = () => useContext(BrandingContext)

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [cssVarsApplied, setCssVarsApplied] = useState(false)

  // Fetch user's plan
  const { data: userPlanData, isLoading: isPlanLoading } = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      try {
        const res = await client.payment.getUserPlan.$get()
        return await res.json()
      } catch (error) {
        console.error("Failed to fetch user plan:", error)
        return { plan: "FREE" as Plan }
      }
    },
  })

  // Fetch branding data
  const { data: brandingData, isLoading: isBrandingLoading } = useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      try {
        const res = await client.project.getBranding.$get()
        return await res.json()
      } catch (error) {
        console.error("Failed to fetch branding settings:", error)
        return defaultBranding
      }
    },
  })

  const branding: BrandingSettings = brandingData || defaultBranding
  const isPro = userPlanData?.plan === "PRO"
  const isLoading = isPlanLoading || isBrandingLoading

  // Apply branding CSS variables when data is loaded and user has PRO plan
  useEffect(() => {
    if (!brandingData || cssVarsApplied || !isPro) return

    const root = document.documentElement
    
    if (brandingData.primaryColor) {
      root.style.setProperty('--brand-primary', brandingData.primaryColor)
    }
    
    if (brandingData.secondaryColor) {
      root.style.setProperty('--brand-secondary', brandingData.secondaryColor)
    }

    setCssVarsApplied(true)
  }, [brandingData, cssVarsApplied, isPro])

  return (
    <BrandingContext.Provider value={{ branding, isLoading, isPro }}>
      {children}
    </BrandingContext.Provider>
  )
}