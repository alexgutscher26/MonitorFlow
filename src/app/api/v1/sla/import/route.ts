import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { z } from "zod";

const slaSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  target: z.number().min(0).max(100),
  timeWindow: z.enum(["24h", "7d", "30d"]),
  category: z.object({
    emoji: z.string(),
    name: z.string()
  }).optional(),
  warningThreshold: z.number().min(0).max(100).optional(),
  criticalThreshold: z.number().min(0).max(100).optional(),
  enableNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  webhookNotifications: z.boolean().optional(),
  webhookUrl: z.string().url().optional().nullable(),
});

const importSchema = z.object({
  slas: z.array(slaSchema)
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { slas } = importSchema.parse(json);

    // Get user's plan and SLA quota
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get current SLA count
    const currentSLACount = await db.sLA.count({
      where: { userId }
    });

    // Check quota
    const maxSLAs = user.plan === "FREE" ? 1 : 10; // Adjust based on your actual quotas
    if (currentSLACount + slas.length > maxSLAs) {
      return new NextResponse(
        `SLA quota exceeded. Your plan allows ${maxSLAs} SLAs.`, 
        { status: 400 }
      );
    }

    // Process each SLA
    const createdSLAs = await Promise.all(
      slas.map(async (sla) => {
        // Find or create category if provided
        let categoryId = null;
        if (sla.category) {
          const category = await db.eventCategory.upsert({
            where: {
              userId_name: {
                userId,
                name: sla.category.name
              }
            },
            create: {
              name: sla.category.name,
              emoji: sla.category.emoji,
              userId
            },
            update: {
              emoji: sla.category.emoji
            }
          });
          categoryId = category.id;
        }

        // Create SLA
        return db.sLA.create({
          data: {
            name: sla.name,
            description: sla.description,
            target: sla.target,
            timeWindow: sla.timeWindow,
            warningThreshold: sla.warningThreshold,
            criticalThreshold: sla.criticalThreshold,
            enableNotifications: sla.enableNotifications,
            emailNotifications: sla.emailNotifications,
            webhookNotifications: sla.webhookNotifications,
            webhookUrl: sla.webhookUrl,
            userId,
            categoryId
          }
        });
      })
    );

    return NextResponse.json(createdSLAs);
  } catch (error) {
    console.error("Error importing SLAs:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
