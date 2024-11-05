"use client"

import { Card } from "@/components/ui/card"

interface StatsProps {
  totalEvents: number
  totalCategories: number
  last24HourEvents: number
  activeIntegrations: number
}

export default function StatsCards({
  totalEvents, 
  totalCategories, 
  last24HourEvents, 
  activeIntegrations 
}: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="mt-2 text-3xl font-semibold">{totalEvents}</p>
        </div>
      </Card>
      {/* ... other cards ... */}
    </div>
  )
}
