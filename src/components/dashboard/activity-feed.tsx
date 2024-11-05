// src/components/dashboard/activity-feed.tsx
"use client"

import { Card } from "@/components/ui/card"

interface Activity {
  id: string
  category: string
  message: string
  timestamp: Date
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) { // Change to default export
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border-b border-gray-100 pb-4">
                <p>{activity.message}</p>
                <p className="text-sm text-gray-500">
                  {activity.category} - {activity.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
