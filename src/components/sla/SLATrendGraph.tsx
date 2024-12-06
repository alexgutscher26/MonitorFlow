"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo, useCallback } from "react"

interface SLAMeasurement {
  uptimePercent: number
  endTime: Date
}

interface SLATrendGraphProps {
  measurements: SLAMeasurement[]
  target: number
  title?: string
  isLoading?: boolean
  error?: string
}

const timeRanges = {
  "7d": "Last 7 Days",
  "14d": "Last 14 Days",
  "30d": "Last 30 Days",
  all: "All Time",
} as const

type TimeRange = keyof typeof timeRanges

export function SLATrendGraph({
  measurements,
  target,
  title = "Historical SLA Performance",
  isLoading = false,
  error,
}: SLATrendGraphProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d")

  // Memoize filtered and processed data
  const { data, stats } = useMemo(() => {
    const filteredData = (() => {
      if (timeRange === "all") return measurements

      const now = new Date()
      const days = parseInt(timeRange)
      const cutoff = new Date(now.setDate(now.getDate() - days))

      return measurements.filter((m) => new Date(m.endTime) >= cutoff)
    })()

    const processedData = filteredData
      .map((m) => ({
        time: new Date(m.endTime).toLocaleDateString(),
        uptime: Number(m.uptimePercent.toFixed(2)),
        date: new Date(m.endTime),
      }))
      .reverse()

    const stats = {
      current: processedData[processedData.length - 1]?.uptime ?? 0,
      average: processedData.length
        ? Number(
            (
              processedData.reduce((acc, curr) => acc + curr.uptime, 0) /
              processedData.length
            ).toFixed(2)
          )
        : 0,
      min: processedData.length
        ? Math.min(...processedData.map((d) => d.uptime))
        : 0,
      max: processedData.length
        ? Math.max(...processedData.map((d) => d.uptime))
        : 0,
    }

    return { data: processedData, stats }
  }, [measurements, timeRange])

  // Custom tooltip with memoization
  const CustomTooltip = useCallback(
    ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const uptimeData = payload[0].payload
        return (
          <div
            className="rounded-lg border bg-background p-2 shadow-sm"
            role="tooltip"
          >
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {new Date(uptimeData.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Uptime
                </span>
                <span className="font-bold">{uptimeData.uptime}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Target
                </span>
                <span className="font-bold">{target}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  Status
                </span>
                <span
                  className={`font-bold ${uptimeData.uptime >= target ? "text-green-500" : "text-red-500"}`}
                >
                  {uptimeData.uptime >= target ? "Meeting SLA" : "Below Target"}
                </span>
              </div>
            </div>
          </div>
        )
      }
      return null
    },
    [target]
  )

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center p-6 text-red-500">
          <p role="alert">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center p-6">
          <p role="status">Loading SLA data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data.length) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center p-6">
          <p role="status">
            No SLA data available for the selected time range.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full bg-green-500"
                  aria-hidden="true"
                />
                <span>Current: {stats.current}%</span>
              </div>
              <div
                className="h-4 w-px bg-border hidden sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                <span>Avg: {stats.average}%</span>
              </div>
              <div
                className="h-4 w-px bg-border hidden sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full bg-red-500"
                  aria-hidden="true"
                />
                <span>Min: {stats.min}%</span>
              </div>
              <div
                className="h-4 w-px bg-border hidden sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full bg-yellow-500"
                  aria-hidden="true"
                />
                <span>Max: {stats.max}%</span>
              </div>
            </div>
            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeRanges).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="h-[300px] w-full mt-4"
          role="img"
          aria-label="SLA Trend Graph"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="time"
                fontSize={12}
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                fontSize={12}
                domain={[
                  Math.min(
                    Math.floor(Math.min(...data.map((d) => d.uptime)) - 5),
                    0
                  ),
                  100,
                ]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fill: "currentColor" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={target}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{
                  value: `Target (${target}%)`,
                  position: "right",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                animationDuration={750}
                animationBegin={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
