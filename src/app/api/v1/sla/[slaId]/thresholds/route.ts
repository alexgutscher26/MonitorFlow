import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { sla } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const thresholdSchema = z.object({
  warningThreshold: z.number()
    .min(0, "Warning threshold must be at least 0")
    .max(100, "Warning threshold cannot exceed 100"),
  criticalThreshold: z.number()
    .min(0, "Critical threshold must be at least 0")
    .max(100, "Critical threshold cannot exceed 100"),
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  webhookNotifications: z.boolean(),
  webhookUrl: z.string().url().optional().or(z.literal("")),
});

export async function PUT(
  request: Request,
  { params }: { params: { slaId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = thresholdSchema.parse(body);

    // Update SLA thresholds in database
    await db
      .update(sla)
      .set({
        warningThreshold: validatedData.warningThreshold,
        criticalThreshold: validatedData.criticalThreshold,
        enableNotifications: validatedData.enableNotifications,
        emailNotifications: validatedData.emailNotifications,
        webhookNotifications: validatedData.webhookNotifications,
        webhookUrl: validatedData.webhookUrl || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(sla.id, params.slaId),
          eq(sla.userId, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating SLA thresholds:", error);
    return new NextResponse(
      error instanceof z.ZodError
        ? "Invalid request data"
        : "Internal server error",
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}
