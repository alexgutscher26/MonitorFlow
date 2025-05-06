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
import { toast } from "sonner"
import { useBranding } from "./branding-provider"
import { UploadCloud } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

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
    .optional()
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
      secondaryColor: "#3F37C9"
    },
  })

  // Update form when data is loaded
  useEffect(() => {
    if (brandingData) {
      reset({
        logo: brandingData.logo || "",
        primaryColor: brandingData.primaryColor || "#4361EE",
        secondaryColor: brandingData.secondaryColor || "#3F37C9"
      })
      
      if (brandingData.logo) {
        setLogoPreview(brandingData.logo)
      }
    }
  }, [brandingData, reset])

  const primaryColor = watch("primaryColor")
  const secondaryColor = watch("secondaryColor")

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
        primaryColor: brandingData.primaryColor || "#4361EE",
        secondaryColor: brandingData.secondaryColor || "#3F37C9"
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
        setValue("logo", result, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Branding Settings</h2>
          <p className="text-sm text-gray-600">
            Customize your application with your brand colors and logo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isPending}
              className="text-sm"
            >
              Discard Changes
            </Button>
          )}

          <Button
            onClick={handleSubmit((data) => updateBranding(data))}
            disabled={!isDirty || isPending}
            className="text-sm"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="design">Logo</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6 pt-4">
          {/* Logo Upload */}
          <div>
            <Label htmlFor="logo" className="text-sm font-medium mb-2 block">
              Logo
            </Label>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-xs text-gray-500">Upload Logo</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="absolute inset-0 bg-black/50 items-center justify-center hidden group-hover:flex">
                    <p className="text-white text-xs font-medium">
                      Change Logo
                    </p>
                  </div>
                </div>

                {logoError && (
                  <p className="text-red-500 text-xs mt-2">{logoError}</p>
                )}
              </div>

              <div className="flex-grow space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Logo Guidelines
                  </h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-2 list-disc pl-4">
                    <li>Maximum file size: 2MB</li>
                    <li>Recommended dimensions: 512x512 pixels</li>
                    <li>File types: PNG, JPG, or SVG</li>
                    <li>
                      For best results, use a transparent background (PNG or SVG)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6 pt-4">
          {/* Color Pickers */}
          <div className="grid gap-6 max-w-md">
            <div>
              <Label
                htmlFor="primaryColor"
                className="text-sm font-medium mb-2 block"
              >
                Primary Color
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  {...register("primaryColor")}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) =>
                    setValue("primaryColor", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="font-mono uppercase"
                  maxLength={7}
                />
              </div>
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
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) =>
                    setValue("secondaryColor", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Suggested Color Palettes
            </h4>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {COLOR_PALETTES.map((palette, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setValue("primaryColor", palette.primary, {
                      shouldDirty: true,
                    })
                    setValue("secondaryColor", palette.secondary, {
                      shouldDirty: true,
                    })
                  }}
                  className="p-3 rounded-lg border hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="h-8 rounded"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="h-8 rounded"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}