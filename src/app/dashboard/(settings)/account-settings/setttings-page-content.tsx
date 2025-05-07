"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomBrandingForm } from "@/components/custom-branding-form"

/**
 * Renders account settings with tabs for general and branding sections.
 */
export const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordID.$post({ discordId })
      return await res.json()
    },
  })

  return (
    <Tabs defaultValue="general" value="general" className="w-full max-w-3xl">
      <TabsList className="mb-6">
        <TabsTrigger asChild value="general"><div>General</div></TabsTrigger>
        <TabsTrigger asChild value="branding"><div>Branding</div></TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card className="max-w-xl w-full space-y-4">
          <div className="pt-2">
            <Label>Discord ID</Label>
            <Input
              className="mt-1"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="Enter your Discord ID"
            />
          </div>

          <p className="mt-2 text-sm/6 text-gray-600">
            Don't know how to find your Discord ID?{" "}
            <Link href="#" className="text-brand-600 hover:text-brand-500">
              Learn how to obtain it here
            </Link>
            .
          </p>

          <div className="pt-4">
            <Button onClick={() => mutate(discordId)} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="branding">
        <CustomBrandingForm />
      </TabsContent>
    </Tabs>
  )
}
