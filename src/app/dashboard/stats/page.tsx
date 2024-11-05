// src/app/dashboard/stats/page.tsx

import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { format, startOfMonth, subDays } from "date-fns"
import { QuickStatCard } from "@/components/dashboard/quick-stat-card"

export default async function StatsPage() {
  const auth = await currentUser()
  if (!auth) return notFound()

  const now = new Date()
  const startOfMonthDate = startOfMonth(now)
  const last30Days = subDays(now, 30)

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
    include: {
      _count: {
        select: {
          events: true,
          EventCategories: true,
        },
      },
      events: {
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          EventCategory: true,
        },
      },
      EventCategories: {
        include: {
          _count: {
            select: {
              events: true
            }
          }
        }
      },
    },
  })

  if (!user) return notFound()

  // Calculate stats
  const monthlyEvents = user.events.length
  const quotaLimit = user.plan === 'PRO' ? PRO_QUOTA.maxEventsPerMonth : FREE_QUOTA.maxEventsPerMonth
  const quotaUsagePercentage = (monthlyEvents / quotaLimit) * 100

  // Calculate success/error rates, using optional chaining to avoid undefined errors
  const successEvents = user.events.filter(event => event.formattedMessage?.toLowerCase().includes('error') === false).length
  const errorEvents = monthlyEvents - successEvents
  const successRate = monthlyEvents > 0 ? (successEvents / monthlyEvents) * 100 : 0

  // Prepare data for charts
  const eventsByDay = user.events.reduce((acc, event) => {
    const day = format(new Date(event.createdAt), 'MMM dd')
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const trendData = Object.entries(eventsByDay).map(([date, count]) => ({
    date,
    count
  }))

  const categoryData = user.EventCategories.map(category => ({
    name: category.name,
    value: category._count.events,
    emoji: category.emoji
  }))

  return (
    <DashboardPage title="Analytics Dashboard">
      <div className="space-y-6">
        {/* TODO Fix the stats */}
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickStatCard
            title="Total Events"
            value={user._count.events}
            trend="+12.5%"
            trendUp={true}
          />
          <QuickStatCard
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            trend="+5.2%"
            trendUp={true}
          />
          <QuickStatCard
            title="Error Events"
            value={errorEvents}
            trend="-2.3%"
            trendUp={false}
          />
          <QuickStatCard
            title="Categories"
            value={user._count.EventCategories}
            trend="0%"
            neutral
          />
        </div>

        {/* Quota Usage */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Monthly Quota Usage</h3>
              <span className="text-sm text-gray-500">
                {monthlyEvents} of {quotaLimit} events
              </span>
            </div>
            <Progress value={quotaUsagePercentage} className="h-2" />
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <span>{quotaUsagePercentage.toFixed(1)}% used</span>
              <span>{quotaLimit - monthlyEvents} events remaining</span>
            </div>
          </div>
        </Card>

        {/* Category Details */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Details</h3>
            <div className="space-y-4">
              {user.EventCategories.map(category => (
                <div 
                  key={category.name} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.emoji}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {category._count.events} events
                    </span>
                    <span className="text-sm font-medium">
                      {((category._count.events / monthlyEvents) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardPage>
  )
}
