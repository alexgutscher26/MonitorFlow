"use client"

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import Link from "next/link"
import { toast } from "sonner"
import { 
  Save, 
  RefreshCw, 
  HelpCircle, 
  User, 
  Palette
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomBrandingForm } from "@/components/custom-branding-form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Renders account settings with tabs for general and branding sections.
 */
export const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)
  const [activeTab, setActiveTab] = useState("general")
  const [originalDiscordId, setOriginalDiscordId] = useState(initialDiscordId)
  const queryClient = useQueryClient()

  // Reset form when initial data changes
  useEffect(() => {
    setDiscordId(initialDiscordId)
    setOriginalDiscordId(initialDiscordId)
  }, [initialDiscordId])

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordID.$post({ discordId })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      setOriginalDiscordId(discordId) // Update original after successful save
      toast.success("Discord ID updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update Discord ID", {
        description: "Please try again or contact support if the issue persists."
      })
    }
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const hasChanges = discordId !== originalDiscordId
  
  const handleResetForm = () => {
    setDiscordId(originalDiscordId)
    toast.info("Changes discarded")
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-3xl">
      <TabsList className="mb-6 grid grid-cols-2 w-full max-w-md">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>General</span>
        </TabsTrigger>
        <TabsTrigger value="branding" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Branding</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card className="max-w-xl w-full shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and integration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="discord-id" className="text-sm font-medium">
                  Discord ID
                </Label>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" 
                        target="_blank" 
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        <HelpCircle className="h-4 w-4 mr-1" />
                        <span className="sr-only md:not-sr-only">How to find your ID</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Learn how to find your Discord ID
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="mt-1.5">
                <Input
                  id="discord-id"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  placeholder="Enter your Discord ID"
                  className="font-mono"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Your Discord ID is used for notifications and access to Discord-exclusive features.
                </p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                onClick={() => mutate(discordId)} 
                disabled={isPending || !hasChanges}
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
              
              {hasChanges && (
                <Button 
                  variant="outline" 
                  onClick={handleResetForm}
                  disabled={isPending}
                >
                  Discard Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="branding">
        <CustomBrandingForm />
      </TabsContent>
    </Tabs>
  )
}