"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Plan } from "@prisma/client"
import { headers } from "next/headers"

type BrandingSettings = {
  logo: string | null
  primaryColor: string | null
  secondaryColor: string | null
  customDomain: string | null
}

type BrandingContextType = {
  branding: BrandingSettings
  isLoading: boolean
  isPro: boolean
  isCustomDomain: boolean
}

const defaultBranding: BrandingSettings = {
  logo: null,
  primaryColor: null,
  secondaryColor: null,
  customDomain: null,
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  isLoading: true,
  isPro: false,
  isCustomDomain: false,
})

export const useBranding = () => useContext(BrandingContext)

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [cssVarsApplied, setCssVarsApplied] = useState(false)
  const [isCustomDomain, setIsCustomDomain] = useState(false)
  const [customDomainUserId, setCustomDomainUserId] = useState<string | null>(null)
  
  // Check if we're on a custom domain
  useEffect(() => {
    // Check for the custom domain header that was set in middleware
    const customDomainUserId = document.cookie
      .split('; ')
      .find(row => row.startsWith('x-custom-domain-user-id='))
      ?.split('=')?.[1];
      
    if (customDomainUserId) {
      setIsCustomDomain(true);
      setCustomDomainUserId(customDomainUserId);
    }
    
    // Alternative method: check if hostname is not the main domain
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && !hostname.includes('pingpanda.io')) {
      setIsCustomDomain(true);
    }
  }, []);

  // Fetch user plan information
  const { data: userPlanData, isLoading: isPlanLoading } = useQuery({
    queryKey: ["user-plan", customDomainUserId],
    queryFn: async () => {
      try {
        // If we're on a custom domain and have a user ID, we can assume they're on PRO
        if (isCustomDomain && customDomainUserId) {
          return { plan: "PRO" as Plan };
        }
        
        const res = await client.payment.getUserPlan.$get()
        return await res.json()
      } catch (error) {
        console.error("Failed to fetch user plan:", error)
        return { plan: "FREE" as Plan }
      }
    },
  })

  const { data: brandingData, isLoading: isBrandingLoading } = useQuery({
    queryKey: ["branding", customDomainUserId],
    queryFn: async () => {
      try {
        // If we're on a custom domain and have a user ID, fetch branding for that user
        if (isCustomDomain && customDomainUserId) {
          // In a real implementation, you would have an API endpoint to fetch branding by user ID
          // For now, we'll use the hostname to identify the custom domain
          const hostname = window.location.hostname;
          const res = await fetch(`/api/branding/by-domain?domain=${hostname}`);
          return await res.json();
        }
        
        const res = await client.project.getBranding.$get()
        return await res.json()
      } catch (error) {
        console.error("Failed to fetch branding settings:", error)
        return defaultBranding
      }
    },
  })

  const branding: BrandingSettings = brandingData || defaultBranding
  const isPro = userPlanData?.plan === "PRO" || isCustomDomain
  const isLoading = isPlanLoading || isBrandingLoading

  // Apply branding CSS variables when data is loaded and user has PRO plan
  useEffect(() => {
    if (!brandingData || cssVarsApplied || (!isPro && !isCustomDomain)) return

    const root = document.documentElement
    
    if (brandingData.primaryColor) {
      root.style.setProperty('--brand-primary', brandingData.primaryColor)
    }
    
    if (brandingData.secondaryColor) {
      root.style.setProperty('--brand-secondary', brandingData.secondaryColor)
    }

    setCssVarsApplied(true)
  }, [brandingData, cssVarsApplied, isPro, isCustomDomain])

  return (
    <BrandingContext.Provider value={{ branding, isLoading, isPro, isCustomDomain }}>
      {children}
    </BrandingContext.Provider>
  )
}