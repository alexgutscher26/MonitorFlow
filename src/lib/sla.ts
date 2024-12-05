import { db } from "@/db"
import { addHours, subHours, parseISO } from "date-fns"

export type TimeWindow = "24h" | "7d" | "30d"

export async function calculateUptimePercentage(
  slaId: string,
  startTime: Date,
  endTime: Date
): Promise<number> {
  const sla = await db.sLADefinition.findUnique({
    where: { id: slaId },
    include: { EventCategory: true },
  })

  if (!sla || !sla.EventCategory) {
    return 0
  }

  const events = await db.event.findMany({
    where: {
      eventCategoryId: sla.EventCategory.id,
      createdAt: {
        gte: startTime,
        lte: endTime,
      },
    },
    orderBy: { createdAt: "asc" },
  })

  if (events.length === 0) {
    return 100 // No events means no downtime
  }

  let totalDowntimeMs = 0
  let lastEvent = events[0]

  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i]

    if ((lastEvent.fields as any).status === "down") {
      totalDowntimeMs +=
        currentEvent.createdAt.getTime() - lastEvent.createdAt.getTime()
    }

    lastEvent = currentEvent
  }

  // If the last event is "down", count downtime until endTime
  if ((lastEvent.fields as any).status === "down") {
    totalDowntimeMs += endTime.getTime() - lastEvent.createdAt.getTime()
  }

  const totalTimeMs = endTime.getTime() - startTime.getTime()
  const uptimePercent = ((totalTimeMs - totalDowntimeMs) / totalTimeMs) * 100

  return Math.max(0, Math.min(100, uptimePercent))
}

export async function updateSLAMeasurements() {
  const slaDefinitions = await db.sLADefinition.findMany()

  const now = new Date()

  for (const sla of slaDefinitions) {
    let startTime: Date
    const endTime = now

    // Parse time window
    switch (sla.timeWindow) {
      case "24h":
        startTime = subHours(now, 24)
        break
      case "7d":
        startTime = subHours(now, 24 * 7)
        break
      case "30d":
        startTime = subHours(now, 24 * 30)
        break
      default:
        console.error(`Invalid time window: ${sla.timeWindow}`)
        continue
    }

    const uptimePercent = await calculateUptimePercentage(
      sla.id,
      startTime,
      endTime
    )

    const totalMinutes = (endTime.getTime() - startTime.getTime()) / 1000 / 60
    const downtimeMinutes = totalMinutes * (1 - uptimePercent / 100)

    await db.sLAMeasurement.create({
      data: {
        slaDefinitionId: sla.id,
        startTime,
        endTime,
        uptimePercent,
        downtimeMinutes,
      },
    })
  }
}
