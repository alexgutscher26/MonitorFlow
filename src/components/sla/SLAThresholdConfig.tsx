"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Settings2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const thresholdSchema = z.object({
  warningThreshold: z
    .number()
    .min(0, "Warning threshold must be at least 0")
    .max(100, "Warning threshold cannot exceed 100"),
  criticalThreshold: z
    .number()
    .min(0, "Critical threshold must be at least 0")
    .max(100, "Critical threshold cannot exceed 100"),
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  webhookNotifications: z.boolean(),
  webhookUrl: z.string().url().optional().or(z.literal("")),
})

interface ThresholdFormValues {
  warningThreshold: number
  criticalThreshold: number
  enableNotifications: boolean
  emailNotifications: boolean
  webhookNotifications: boolean
  webhookUrl?: string
}

interface SLAThresholdConfigProps {
  slaId: string
  target: number
  initialThresholds?: Partial<ThresholdFormValues>
}

export function SLAThresholdConfig({
  slaId,
  target,
  initialThresholds,
}: SLAThresholdConfigProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ThresholdFormValues>({
    resolver: zodResolver(thresholdSchema),
    defaultValues: {
      warningThreshold: initialThresholds?.warningThreshold ?? target - 2,
      criticalThreshold: initialThresholds?.criticalThreshold ?? target - 5,
      enableNotifications: initialThresholds?.enableNotifications ?? true,
      emailNotifications: initialThresholds?.emailNotifications ?? true,
      webhookNotifications: initialThresholds?.webhookNotifications ?? false,
      webhookUrl: initialThresholds?.webhookUrl ?? "",
    },
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Watch values for dynamic validation
  const warningThreshold = form.watch("warningThreshold")
  const criticalThreshold = form.watch("criticalThreshold")
  const webhookNotifications = form.watch("webhookNotifications")

  // Validate thresholds whenever they change
  useEffect(() => {
    if (warningThreshold > target) {
      form.setError("warningThreshold", {
        type: "manual",
        message: "Warning threshold cannot be higher than the target",
      })
    } else if (criticalThreshold > warningThreshold) {
      form.setError("criticalThreshold", {
        type: "manual",
        message: "Critical threshold cannot be higher than warning threshold",
      })
    } else {
      form.clearErrors(["warningThreshold", "criticalThreshold"])
    }
  }, [warningThreshold, criticalThreshold, target, form])

  const onSubmit = async (data: ThresholdFormValues) => {
    try {
      setIsSubmitting(true)

      // Update SLA thresholds
      const response = await fetch(`/api/sla/${slaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warningThreshold: data.warningThreshold,
          criticalThreshold: data.criticalThreshold,
          notifications: {
            enabled: data.enableNotifications,
            email: data.emailNotifications,
            webhook: data.webhookNotifications,
            webhookUrl: data.webhookUrl || null,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update thresholds")
      }

      toast.success("Alert thresholds updated successfully")
      setOpen(false)
    } catch (error) {
      console.error("Error updating thresholds:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update alert thresholds"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Configure Alert Settings"
        >
          <Settings2 className="h-4 w-4 mr-2" aria-hidden="true" />
          Alert Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alert Thresholds</DialogTitle>
          <DialogDescription>
            Configure when to receive alerts before SLA breaches occur. Target
            SLA is {target}%.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warningThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warning Threshold (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max={target}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      aria-describedby="warning-threshold-description"
                    />
                  </FormControl>
                  <FormDescription id="warning-threshold-description">
                    Alert when uptime falls below this percentage (must be below{" "}
                    {target}%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criticalThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Critical Threshold (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max={warningThreshold}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      aria-describedby="critical-threshold-description"
                    />
                  </FormControl>
                  <FormDescription id="critical-threshold-description">
                    Alert when uptime falls below this critical level (must be
                    below {warningThreshold}%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enableNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive alerts when thresholds are breached
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Enable notifications"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("enableNotifications") && (
              <>
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Send alerts to your email address
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Enable email notifications"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webhookNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Webhook Notifications
                        </FormLabel>
                        <FormDescription>
                          Send alerts to a webhook URL
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Enable webhook notifications"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {webhookNotifications && (
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://your-webhook-url.com"
                            {...field}
                            aria-describedby="webhook-url-description"
                          />
                        </FormControl>
                        <FormDescription id="webhook-url-description">
                          Enter the URL where webhook notifications should be
                          sent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
