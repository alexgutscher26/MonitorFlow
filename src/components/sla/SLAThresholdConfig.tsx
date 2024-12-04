"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const thresholdSchema = z.object({
  warningThreshold: z.number()
    .min(0, "Warning threshold must be at least 0")
    .max(100, "Warning threshold cannot exceed 100"),
  criticalThreshold: z.number()
    .min(0, "Critical threshold must be at least 0")
    .max(100, "Critical threshold cannot exceed 100"),
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  webhookNotifications: z.boolean(),
  webhookUrl: z.string().url().optional().or(z.literal("")),
});

type ThresholdFormValues = z.infer<typeof thresholdSchema>;

interface SLAThresholdConfigProps {
  slaId: string;
  target: number;
  initialThresholds?: {
    warningThreshold: number;
    criticalThreshold: number;
    enableNotifications: boolean;
    emailNotifications: boolean;
    webhookNotifications: boolean;
    webhookUrl?: string;
  };
}

export function SLAThresholdConfig({
  slaId,
  target,
  initialThresholds,
}: SLAThresholdConfigProps) {
  const [open, setOpen] = useState(false);

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
  });

  const onSubmit = async (data: ThresholdFormValues) => {
    try {
      // Validate thresholds relative to target
      if (data.warningThreshold > target) {
        toast.error("Warning threshold cannot be higher than the target");
        return;
      }
      if (data.criticalThreshold > data.warningThreshold) {
        toast.error("Critical threshold cannot be higher than warning threshold");
        return;
      }

      // Update SLA thresholds using your existing API
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
      });

      if (!response.ok) {
        throw new Error("Failed to update thresholds");
      }

      toast.success("Alert thresholds updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error updating thresholds:", error);
      toast.error("Failed to update alert thresholds");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alert Thresholds</DialogTitle>
          <DialogDescription>
            Configure when to receive alerts before SLA breaches occur.
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
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Alert when uptime falls below this percentage
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
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Alert when uptime falls below this critical level
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
                    <FormLabel className="text-base">Enable Notifications</FormLabel>
                    <FormDescription>
                      Receive alerts when thresholds are breached
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <FormDescription>
                          Send alerts to your email address
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                        <FormLabel className="text-base">Webhook Notifications</FormLabel>
                        <FormDescription>
                          Send alerts to a webhook URL
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("webhookNotifications") && (
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://your-webhook-url.com" />
                        </FormControl>
                        <FormDescription>
                          The URL where alert notifications will be sent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
