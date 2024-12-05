import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import { db } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"

const createSLASchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  target: z.number().min(0).max(100),
  timeWindow: z.enum(["24h", "7d", "30d"]),
  categoryId: z.string(),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { externalId: userId },
      include: {
        SLADefinitions: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Check SLA limits based on plan
    const maxSLAs = user.plan === "PRO" ? PRO_QUOTA.maxSLAs : FREE_QUOTA.maxSLAs
    if (user.SLADefinitions.length >= maxSLAs) {
      return new NextResponse(
        `You have reached the maximum number of SLAs (${maxSLAs}) for your plan. Please upgrade to create more.`,
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createSLASchema.parse(body)

    const category = await db.eventCategory.findFirst({
      where: {
        id: validatedData.categoryId,
        userId: user.id,
      },
    })

    if (!category) {
      return new NextResponse("Category not found", { status: 404 })
    }

    const sla = await db.sLADefinition.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        target: validatedData.target,
        timeWindow: validatedData.timeWindow,
        userId: user.id,
        EventCategory: {
          connect: {
            id: validatedData.categoryId,
          },
        },
      },
    })

    return NextResponse.json(sla)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }

    console.error("Error creating SLA:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { externalId: userId },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    const slas = await db.sLADefinition.findMany({
      where: {
        userId: user.id,
        ...(categoryId && {
          EventCategory: {
            some: {
              id: categoryId,
            },
          },
        }),
      },
      include: {
        measurements: true,
        EventCategory: true,
      },
    })

    return NextResponse.json(slas)
  } catch (error) {
    console.error("Error fetching SLAs:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { externalId: userId },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get the SLA ID from the URL
    const url = new URL(req.url)
    const slaId = url.searchParams.get("id")

    if (!slaId) {
      return NextResponse.json(
        { message: "SLA ID is required" },
        { status: 400 }
      )
    }

    // Verify the SLA belongs to the user
    const sla = await db.sLADefinition.findFirst({
      where: {
        id: slaId,
        userId: user.id,
      },
    })

    if (!sla) {
      return NextResponse.json({ message: "SLA not found" }, { status: 404 })
    }

    // Delete the SLA and its measurements
    await db.sLAMeasurement.deleteMany({
      where: { slaDefinitionId: slaId },
    })

    await db.sLADefinition.delete({
      where: { id: slaId },
    })

    return NextResponse.json({ message: "SLA deleted successfully" })
  } catch (error) {
    console.error("Error deleting SLA:", error)
    return NextResponse.json(
      { message: "Failed to delete SLA" },
      { status: 500 }
    )
  }
}
