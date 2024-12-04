"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface SLAMeasurement {
  uptimePercent: number;
  endTime: Date;
}

interface SLATrendGraphProps {
  measurements: SLAMeasurement[];
  target: number;
  title?: string;
}

const timeRanges = {
  "7d": "Last 7 Days",
  "14d": "Last 14 Days",
  "30d": "Last 30 Days",
  "all": "All Time"
} as const;

type TimeRange = keyof typeof timeRanges;

export function SLATrendGraph({ measurements, target, title = "Historical SLA Performance" }: SLATrendGraphProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Filter data based on selected time range
  const filterDataByTimeRange = (data: SLAMeasurement[]) => {
    if (timeRange === "all") return data;
    
    const now = new Date();
    const days = parseInt(timeRange);
    const cutoff = new Date(now.setDate(now.getDate() - days));
    
    return data.filter(m => new Date(m.endTime) >= cutoff);
  };

  // Format data for the chart
  const filteredMeasurements = filterDataByTimeRange(measurements);
  const data = filteredMeasurements.map((m) => ({
    time: new Date(m.endTime).toLocaleDateString(),
    uptime: Number(m.uptimePercent.toFixed(2)),
    date: new Date(m.endTime)
  })).reverse();

  // Calculate statistics
  const currentUptime = data[data.length - 1]?.uptime ?? 0;
  const averageUptime = data.reduce((acc, curr) => acc + curr.uptime, 0) / data.length;
  const minUptime = Math.min(...data.map(d => d.uptime));
  const maxUptime = Math.max(...data.map(d => d.uptime));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const uptimeData = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {new Date(uptimeData.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Uptime</span>
              <span className="font-bold">{uptimeData.uptime}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Target</span>
              <span className="font-bold">{target}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Status</span>
              <span className={`font-bold ${uptimeData.uptime >= target ? "text-green-500" : "text-red-500"}`}>
                {uptimeData.uptime >= target ? "Meeting SLA" : "Below Target"}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Current: {currentUptime}%</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Avg: {averageUptime.toFixed(2)}%</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span>Min: {minUptime}%</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Max: {maxUptime}%</span>
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
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                domain={[
                  Math.min(Math.floor(Math.min(...data.map(d => d.uptime)) - 5), 0),
                  100
                ]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={target} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ 
                  value: `Target (${target}%)`,
                  position: 'right',
                  fill: '#ef4444',
                  fontSize: 12
                }}
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
