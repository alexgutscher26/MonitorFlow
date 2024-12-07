import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSLASchema = z.object({
  warningThreshold: z
    .number()
    .min(0, "Warning threshold must be at least 0")
    .max(100, "Warning threshold cannot exceed 100")
    .optional(),
  criticalThreshold: z
    .number()
    .min(0, "Critical threshold must be at least 0")
    .max(100, "Critical threshold cannot exceed 100")
    .optional(),
  notifications: z
    .object({
      enabled: z.boolean(),
      email: z.boolean(),
      webhook: z.boolean(),
      webhookUrl: z.string().url().nullable(),
    })
    .optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { slaId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSLASchema.parse(body)

    // First verify the SLA belongs to the user
    const sla = await prisma.sLADefinition.findFirst({
      where: {
        id: params.slaId,
        userId,
      },
    })

    if (!sla) {
      return new NextResponse("SLA not found", { status: 404 })
    }

    // Update the SLA with new thresholds and notification settings
    const updatedSLA = await prisma.sLADefinition.update({
      where: { id: params.slaId },
      data: {
        warningThreshold: validatedData.warningThreshold,
        criticalThreshold: validatedData.criticalThreshold,
        ...(validatedData.notifications
          ? {
              enableNotifications: validatedData.notifications.enabled,
              emailNotifications: validatedData.notifications.email,
              webhookNotifications: validatedData.notifications.webhook,
              webhookUrl: validatedData.notifications.webhookUrl,
            }
          : {}),
      },
    })

    return NextResponse.json(updatedSLA)
  } catch (error) {
    console.error("Error updating SLA:", error)
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}
