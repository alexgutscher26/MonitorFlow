import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const environment = searchParams.get("environment") || "development"
  const includeArchived = searchParams.get("includeArchived") === "true"

  const flags = await prisma.featureFlag.findMany({
    where: {
      userId,
      environment,
      isArchived: includeArchived ? undefined : false,
    },
    include: {
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  return NextResponse.json(flags)
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const json = await request.json()
  const { key, name, description, type, value, environment, expiresAt } = json

  const flag = await prisma.$transaction(async (tx) => {
    const flag = await tx.featureFlag.create({
      data: {
        key,
        name,
        description,
        type: type || "boolean",
        value: value || null,
        environment: environment || "development",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      },
    })

    await tx.featureFlagAuditLog.create({
      data: {
        flagId: flag.id,
        action: "created",
        changes: { ...flag },
        performedBy: userId,
      },
    })

    return flag
  })

  return NextResponse.json(flag)
}

export async function PATCH(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const json = await request.json()
  const { id, ...updates } = json

  const flag = await prisma.$transaction(async (tx) => {
    const oldFlag = await tx.featureFlag.findUnique({
      where: { id },
    })

    const flag = await tx.featureFlag.update({
      where: {
        id,
        userId,
      },
      data: updates,
    })

    await tx.featureFlagAuditLog.create({
      data: {
        flagId: flag.id,
        action: "updated",
        changes: {
          before: oldFlag,
          after: flag,
        },
        performedBy: userId,
      },
    })

    return flag
  })

  return NextResponse.json(flag)
}

export async function DELETE(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  await prisma.$transaction(async (tx) => {
    const flag = await tx.featureFlag.update({
      where: {
        id,
        userId,
      },
      data: { isArchived: true },
    })

    await tx.featureFlagAuditLog.create({
      data: {
        flagId: flag.id,
        action: "archived",
        changes: { isArchived: true },
        performedBy: userId,
      },
    })
  })

  return NextResponse.json({ success: true })
}
