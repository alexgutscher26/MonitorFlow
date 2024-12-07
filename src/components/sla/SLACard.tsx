"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"

interface SLACardProps {
  sla: {
    name: string
    description?: string
    target: number
    timeWindow: string
    measurements: {
      uptimePercent: number
      endTime: string
    }[]
  }
}

export function SLACard({ sla }: SLACardProps) {
  const latestMeasurement = sla.measurements[0]
  const uptimePercent = latestMeasurement?.uptimePercent ?? 100
  const lastUpdated = latestMeasurement?.endTime
    ? formatDistanceToNow(new Date(latestMeasurement.endTime), {
        addSuffix: true,
      })
    : "Never"

  const getStatusColor = (uptime: number, target: number) => {
    if (uptime >= target) return "bg-green-500"
    if (uptime >= target - 1) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{sla.name}</CardTitle>
        {sla.description && (
          <p className="text-sm text-muted-foreground">{sla.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Uptime</span>
              <span
                className={
                  uptimePercent >= sla.target
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {uptimePercent.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={uptimePercent}
              className={getStatusColor(uptimePercent, sla.target)}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Target: {sla.target}%</span>
            <span>Window: {sla.timeWindow}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
