"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { client } from "@/lib/client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { toast } from "sonner"
import { useBranding } from "./branding-provider"
import { AlertCircle, Upload, RefreshCw, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { DomainVerification } from "./domain-verification"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Skeleton } from "./ui/skeleton"

// Maximum file size for logo uploads (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024 

// Validation schema for the branding form
const BRANDING_VALIDATOR = z.object({
  logo: z.string().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color code")
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color code")
    .optional(),
  customDomain: z
    .string()
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid domain (e.g., app.yourdomain.com)"
    )
    .optional()
    .or(z.literal("")),
})

type BrandingForm = z.infer<typeof BRANDING_VALIDATOR>

// Predefined color palettes with primary and secondary color combinations
const COLOR_PALETTES = [
  { primary: "#4361EE", secondary: "#3F37C9" }, // Blue
  { primary: "#4CC9F0", secondary: "#4895EF" }, // Light Blue
  { primary: "#F72585", secondary: "#B5179E" }, // Pink
  { primary: "#F94144", secondary: "#F3722C" }, // Red to Orange
  { primary: "#90BE6D", secondary: "#43AA8B" }, // Green
  { primary: "#F9C74F", secondary: "#F9844A" }, // Yellow
  { primary: "#6A4C93", secondary: "#8338EC" }, // Purple
  { primary: "#2D3748", secondary: "#4A5568" }, // Dark Gray
]

// Individual color options
const COLOR_OPTIONS = [
  "#FF6B6B", // Bright Red
  "#4ECDC4", // Teal
  "#45B7D1", // Sky Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Seafoam Green
  "#FDCB6E", // Mustard Yellow
  "#6C5CE7", // Soft Purple
  "#FF85A2", // Pink
  "#2ECC71", // Emerald Green
  "#E17055", // Terracotta
]

export const CustomBrandingForm = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("design")
  const queryClient = useQueryClient()
  const { isPro } = useBranding()

  // Fetch branding data
  const { data: brandingData, isLoading } = useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      const res = await client.project.getBranding.$get()
      return await res.json()
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BrandingForm>({
    resolver: zodResolver(BRANDING_VALIDATOR),
    defaultValues: {
      logo: "",
      primaryColor: "#4361EE",
      secondaryColor: "#3F37C9",
      customDomain: "",
    },
  })

  // Update form when data is loaded
  useEffect(() => {
    if (brandingData) {
      reset({
        logo: brandingData.logo || "",
        primaryColor: brandingData.primaryColor || "#4361EE",
        secondaryColor: brandingData.secondaryColor || "#3F37C9",
        customDomain: brandingData.customDomain || "",
      })
      
      if (brandingData.logo) {
        setLogoPreview(brandingData.logo)
      }
    }
  }, [brandingData, reset])

  const primaryColor = watch("primaryColor")
  const secondaryColor = watch("secondaryColor")
  const customDomain = watch("customDomain")

  const { mutate: updateBranding, isPending } = useMutation({
    mutationFn: async (data: BrandingForm) => {
      // In a real implementation, you would handle the file upload here
      // if there's a new logo file before submitting the form data
      const res = await client.project.updateBranding.$post(data)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding"] })
      toast.success("Branding settings updated successfully", {
        description: "Your changes have been applied to your application."
      })
    },
    onError: (error) => {
      toast.error("Failed to update branding settings", {
        description: "Please try again or contact support if the issue persists."
      })
    }
  })

  const resetForm = () => {
    if (brandingData) {
      reset({
        logo: brandingData.logo || "",
        primaryColor: brandingData.primaryColor || "#4361EE",
        secondaryColor: brandingData.secondaryColor || "#3F37C9",
        customDomain: brandingData.customDomain || "",
      })
      
      if (brandingData.logo) {
        setLogoPreview(brandingData.logo)
      } else {
        setLogoPreview(null)
      }
      
      setLogoFile(null)
      setLogoError(null)
    }
    
    toast.info("Changes discarded", {
      description: "Your form has been reset to the last saved settings."
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setLogoError(null)
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setLogoError("Logo file is too large (max 2MB)")
        return
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setLogoError("Please upload a valid image file")
        return
      }
      
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        setValue("logo", result, { shouldDirty: true }) // In reality, this would be the URL from your storage service
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setLogoFile(null)
    setValue("logo", "", { shouldDirty: true })
  }

  const applyColorPalette = (primary: string, secondary: string) => {
    setValue("primaryColor", primary, { shouldDirty: true })
    setValue("secondaryColor", secondary, { shouldDirty: true })
  }

  const onSubmit = (data: BrandingForm) => {
    updateBranding(data)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 p-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-1/4" />
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-disabled={!isPro}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design" disabled={!isPro}>Design</TabsTrigger>
            <TabsTrigger value="domain" disabled={!isPro}>Domain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-6 pt-4">
            {/* Logo Upload */}
            <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
              <Label htmlFor="logo" className="text-sm font-medium mb-2 block">Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden bg-white"
                  aria-label="Logo preview"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      aria-label="Upload logo"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    
                    {logoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Recommended size: 512x512px. Max size: 2MB.
                  </p>
                  
                  {logoError && (
                    <p className="mt-1 text-xs text-red-500">
                      {logoError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Color Palettes */}
            <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
              <Label className="text-sm font-medium mb-2 block">Color Palettes</Label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {COLOR_PALETTES.map((palette, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={`h-16 rounded-md overflow-hidden transition-all hover:scale-105 ${
                            primaryColor === palette.primary && secondaryColor === palette.secondary
                              ? "ring-2 ring-gray-900 scale-105"
                              : ""
                          }`}
                          onClick={() => applyColorPalette(palette.primary, palette.secondary)}
                          aria-label={`Color palette ${index + 1}`}
                        >
                          <div className="flex h-full">
                            <div className="w-1/2 h-full" style={{ backgroundColor: palette.primary }}></div>
                            <div className="w-1/2 h-full" style={{ backgroundColor: palette.secondary }}></div>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Primary: {palette.primary}</p>
                        <p>Secondary: {palette.secondary}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
                <Label htmlFor="primaryColor" className="text-sm font-medium mb-2 block">Primary Color</Label>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-md border border-gray-200"
                    style={{ backgroundColor: primaryColor || "#FFFFFF" }}
                    aria-hidden="true"
                  ></div>
                  <Input
                    id="primaryColor"
                    {...register("primaryColor")}
                    placeholder="#4361EE"
                    className="font-mono"
                  />
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <TooltipProvider key={color}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all ${
                              primaryColor === color
                                ? "ring-gray-900 scale-110"
                                : "ring-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setValue("primaryColor", color, { shouldDirty: true })}
                            aria-label={`Set primary color to ${color}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{color}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  <div className="flex items-center">
                    <Input
                      type="color"
                      value={primaryColor || "#FFFFFF"}
                      onChange={(e) => setValue("primaryColor", e.target.value, { shouldDirty: true })}
                      className="w-8 h-8 p-1 rounded-full overflow-hidden cursor-pointer"
                      aria-label="Custom primary color picker"
                    />
                  </div>
                </div>
                {errors.primaryColor && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.primaryColor.message}
                  </p>
                )}
              </div>

              {/* Secondary Color */}
              <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
                <Label htmlFor="secondaryColor" className="text-sm font-medium mb-2 block">Secondary Color</Label>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-md border border-gray-200"
                    style={{ backgroundColor: secondaryColor || "#FFFFFF" }}
                    aria-hidden="true"
                  ></div>
                  <Input
                    id="secondaryColor"
                    {...register("secondaryColor")}
                    placeholder="#3F37C9"
                    className="font-mono"
                  />
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <TooltipProvider key={color}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all ${
                              secondaryColor === color
                                ? "ring-gray-900 scale-110"
                                : "ring-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setValue("secondaryColor", color, { shouldDirty: true })}
                            aria-label={`Set secondary color to ${color}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{color}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  <div className="flex items-center">
                    <Input
                      type="color"
                      value={secondaryColor || "#FFFFFF"}
                      onChange={(e) => setValue("secondaryColor", e.target.value, { shouldDirty: true })}
                      className="w-8 h-8 p-1 rounded-full overflow-hidden cursor-pointer"
                      aria-label="Custom secondary color picker"
                    />
                  </div>
                </div>
                {errors.secondaryColor && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.secondaryColor.message}
                  </p>
                )}
              </div>
            </div>

            {/* Preview Card */}
            <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="h-16 flex items-center px-4" 
                  style={{ backgroundColor: primaryColor || "#4361EE" }}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="h-8 object-contain bg-white rounded-md p-1"
                    />
                  ) : (
                    <div className="text-white font-bold">Your App</div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <div className="w-full h-8 bg-gray-100 rounded-md mb-3"></div>
                  <div className="w-3/4 h-4 bg-gray-100 rounded-md mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded-md mb-4"></div>
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: secondaryColor || "#3F37C9" }}
                    aria-hidden="true"
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    Button Example
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="domain" className="space-y-6 pt-4">
            {/* Custom Domain */}
            <div className={!isPro ? "opacity-60 pointer-events-none" : ""}>
              <Label htmlFor="customDomain" className="text-sm font-medium mb-2 block">Custom Domain</Label>
              <Input
                id="customDomain"
                {...register("customDomain")}
                placeholder="app.yourdomain.com"
                className="mt-2"
                aria-invalid={errors.customDomain ? "true" : "false"}
              />
              {errors.customDomain && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.customDomain.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Enter the domain you want to use for your application. You'll need to
                configure DNS settings with your domain provider.
              </p>
            </div>
            
            {/* Domain Verification */}
            {isPro && customDomain && (
              <div className="mt-6">
                <DomainVerification domain={customDomain} />
              </div>
            )}
            
            {!customDomain && isPro && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h4 className="text-sm font-medium text-gray-700">No Custom Domain Set</h4>
                <p className="text-xs text-gray-500 mt-2">
                  Add a custom domain above to start the verification process.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CardFooter className="px-0 pt-4 border-t flex flex-wrap gap-3 justify-between">
          <div className="space-x-2">
            <Button 
              type="submit" 
              disabled={isPending || !isPro || !isDirty}
              className="relative"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Branding Settings
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={isPending || !isDirty || !isPro}
            >
              Discard Changes
            </Button>
          </div>
          
          {!isPro && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => window.location.href = "/pricing"}
            >
              Upgrade to PRO
            </Button>
          )}
        </CardFooter>
      </form>
    )
  }

  return (
    <Card className="max-w-3xl w-full">
      <CardHeader>
        <CardTitle>Custom Branding</CardTitle>
        <CardDescription>
          Customize your application with your brand colors, logo, and domain.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isPro && (
          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">PRO Plan Required</AlertTitle>
            <AlertDescription className="text-amber-700">
              Custom branding is a PRO feature. Upgrade your plan to customize your application's appearance.
            </AlertDescription>
          </Alert>
        )}

        {renderContent()}
      </CardContent>
    </Card>
  )
}