"use client"

import { useState, useEffect, MouseEvent, ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { client } from "@/lib/client"
import { Button, buttonVariants } from "./ui/button"
import Link from "next/link"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useBranding } from "./branding-provider"
import { 
  Upload, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  Save
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "./ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { JsonValue } from "@prisma/client/runtime/library"

// Maximum file size for logo uploads (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024 

// Validation schema for the branding form
const BRANDING_VALIDATOR = z.object({
  logo: z.string().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color code"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color code")
})

type BrandingForm = z.infer<typeof BRANDING_VALIDATOR>

// Predefined color palettes with primary and secondary color combinations
const COLOR_PALETTES = [
  { primary: "#4361EE", secondary: "#3F37C9", name: "Blue" },
  { primary: "#4CC9F0", secondary: "#4895EF", name: "Light Blue" },
  { primary: "#F72585", secondary: "#B5179E", name: "Pink" },
  { primary: "#F94144", secondary: "#F3722C", name: "Red Orange" },
  { primary: "#90BE6D", secondary: "#43AA8B", name: "Green" },
  { primary: "#F9C74F", secondary: "#F9844A", name: "Yellow" },
  { primary: "#6A4C93", secondary: "#8338EC", name: "Purple" },
  { primary: "#2D3748", secondary: "#4A5568", name: "Dark Gray" },
]

// Default branding values
const DEFAULT_BRANDING = {
  primaryColor: "#4361EE",
  secondaryColor: "#3F37C9",
  logo: ""
}

export const CustomBrandingForm = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("design")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const queryClient = useQueryClient()
  const { isPro } = useBranding()

  // Fetch branding data
  const { data: brandingData, isLoading } = useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      try {
        const res = await client.project.getBranding.$get()
        return await res.json()
      } catch (error) {
        console.error("Failed to fetch branding:", error)
        return DEFAULT_BRANDING
      }
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
    defaultValues: DEFAULT_BRANDING,
  })

  // Update form when data is loaded
  useEffect(() => {
    if (brandingData) {
      reset({
        logo: brandingData.logo || "",
        primaryColor: brandingData.primaryColor || DEFAULT_BRANDING.primaryColor,
        secondaryColor: brandingData.secondaryColor || DEFAULT_BRANDING.secondaryColor
      })
      
      if (brandingData.logo) {
        setLogoPreview(brandingData.logo)
      }
    }
  }, [brandingData, reset])

  const watchedValues = watch()
  const primaryColor = watchedValues.primaryColor
  const secondaryColor = watchedValues.secondaryColor

  const { mutate: updateBranding, isPending } = useMutation({
    mutationFn: async (data: BrandingForm) => {
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
        primaryColor: brandingData.primaryColor || DEFAULT_BRANDING.primaryColor,
        secondaryColor: brandingData.secondaryColor || DEFAULT_BRANDING.secondaryColor
      })
      
      if (brandingData.logo) {
        setLogoPreview(brandingData.logo)
      } else {
        setLogoPreview(null)
      }
      
      setLogoFile(null)
      setLogoError(null)
      setIsResetDialogOpen(false)
      
      toast.info("Changes discarded", {
        description: "Your form has been reset to the last saved settings."
      })
    }
  }

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setLogoError(null)
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setLogoError(`Logo file is too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
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
        setValue("logo", result, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setLogoFile(null)
    setValue("logo", "", { shouldDirty: true })
  }

  // Generate a preview button with the current colors
  const ColorPreviewButton = () => (
    <div className="flex flex-col items-center mt-4 space-y-2">
      <p className="text-sm text-gray-500">Preview</p>
      <div className="flex space-x-2">
        <Button
          style={{ backgroundColor: primaryColor }}
          className="text-white border-0"
        >
          Primary
        </Button>
        <Button
          style={{ backgroundColor: secondaryColor }}
          className="text-white border-0"
        >
          Secondary
        </Button>
      </div>
    </div>
  )

  const hasError = Object.keys(errors).length > 0 || !!logoError

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Branding Settings</CardTitle>
          <CardDescription>
            {isPro ? (
              "Customize your application with your brand colors and logo"
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Upgrade to PRO to customize your branding
              </div>
            )}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResetDialogOpen(true)}
                    disabled={isPending}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Discard
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Discard all changes
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isPro ? (
            <Button
              onClick={handleSubmit((data) => updateBranding(data))}
              disabled={!isDirty || isPending || hasError}
              size="sm"
              className="px-4"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          ) : null}
        </div>
      </CardHeader>

      {!isPro && (
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 border-y border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Unlock Custom Branding</h3>
                <p className="text-sm text-amber-700">Upgrade to PRO to customize your application's look and feel</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className={buttonVariants({
                size: "sm",
                className: "bg-amber-600 hover:bg-amber-700"
              })}
            >
              Upgrade to PRO
            </Link>
          </div>
        </div>
      )}
      <CardContent className={!isPro ? "opacity-50 pointer-events-none" : ""}>
        {hasError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </p>
              <ul className="mt-1 text-xs text-red-700 list-disc pl-5">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>{error?.message as string}</li>
                ))}
                {logoError && <li>{logoError}</li>}
              </ul>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="design" className="text-sm">
              Logo & Design
            </TabsTrigger>
            <TabsTrigger value="colors" className="text-sm">
              Colors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6 pt-6">
            {/* Logo Upload */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <Label htmlFor="logo" className="text-sm font-medium">
                  Brand Logo
                </Label>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div 
                    className="w-36 h-36 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative group"
                    style={{ 
                      borderColor: logoError ? 'rgb(239 68 68)' : 'rgb(229 231 235)',
                      backgroundColor: logoPreview ? 'white' : 'rgb(249 250 251)'
                    }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Upload Logo</p>
                      </div>
                    )}

                    <input
                      type="file"
                      id="logo"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex">
                      <p className="text-white text-sm font-medium">
                        {logoPreview ? "Change Logo" : "Select File"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Logo Guidelines
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                      <li>Maximum file size: 2MB</li>
                      <li>Recommended dimensions: 512x512 pixels</li>
                      <li>Accepted formats: PNG, JPG, or SVG</li>
                      <li>
                        For best results, use a transparent background (PNG or SVG)
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500">
                      Your logo will appear in the navigation bar, emails, and other branded touchpoints in your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Color Pickers */}
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="primaryColor"
                    className="text-sm font-medium mb-2 block"
                  >
                    Primary Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Input
                        id="primaryColor"
                        type="color"
                        {...register("primaryColor")}
                        className="w-16 h-9 p-1 cursor-pointer"
                      />
                    </div>
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.startsWith('#') && value.length <= 7) {
                          setValue("primaryColor", value, { shouldDirty: true });
                        }
                      }}
                      className="font-mono uppercase w-32"
                      placeholder="#RRGGBB"
                      maxLength={7}
                    />
                    {errors.primaryColor && (
                      <span className="text-red-500">
                        <AlertCircle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for buttons, links, and primary actions
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="secondaryColor"
                    className="text-sm font-medium mb-2 block"
                  >
                    Secondary Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      {...register("secondaryColor")}
                      className="w-16 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.startsWith('#') && value.length <= 7) {
                          setValue("secondaryColor", value, { shouldDirty: true });
                        }
                      }}
                      className="font-mono uppercase w-32"
                      placeholder="#RRGGBB"
                      maxLength={7}
                    />
                    {errors.secondaryColor && (
                      <span className="text-red-500">
                        <AlertCircle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for accents, highlights, and secondary elements
                  </p>
                </div>

                <ColorPreviewButton />
              </div>

              {/* Color Palettes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Suggested Color Palettes
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_PALETTES.map((palette, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setValue("primaryColor", palette.primary, {
                          shouldDirty: true,
                        })
                        setValue("secondaryColor", palette.secondary, {
                          shouldDirty: true,
                        })
                      }}
                      className="p-3 rounded-lg border hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="h-10 rounded"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="h-10 rounded"
                          style={{ backgroundColor: palette.secondary }}
                        />
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-600">{palette.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Confirmation Dialog for Reset */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard all changes? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetForm} className="bg-red-500 hover:bg-red-600">
              Yes, discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}