"use client"

import { useBranding } from "./branding-provider"

type BrandedLogoProps = {
  className?: string
  defaultText?: boolean
}

export const BrandedLogo = ({ className = "", defaultText = true }: BrandedLogoProps) => {
  const { branding, isPro } = useBranding()
  
  // If there's a custom logo and user has PRO plan, display it
  if (branding.logo && isPro) {
    return (
      <img 
        src={branding.logo} 
        alt="Brand Logo" 
        className={`brand-logo ${className}`}
      />
    )
  }
  
  // Otherwise show the default logo/text
  return (
    <p className={`text-lg/7 font-semibold ${className}`}>
      Ping<span className="text-brand-700">Panda</span>
    </p>
  )
}