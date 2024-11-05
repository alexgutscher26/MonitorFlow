import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  const auth = await currentUser()
  
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

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
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10, // Recent 10 events
        include: {
          EventCategory: true,
        },
      },
    },
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  return Response.json({
    stats: {
      totalEvents: user._count.events,
      totalCategories: user._count.EventCategories,
      last24HourEvents: user.events.length,
      activeIntegrations: user.discordId ? 1 : 0,
    },
    recentActivity: user.events,
  })
}
