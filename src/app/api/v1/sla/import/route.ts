import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sla } from "@/db/schema";
import { z } from "zod";

const importSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  warningThreshold: z.number().min(0).max(100),
  criticalThreshold: z.number().min(0).max(100),
  enableNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  webhookNotifications: z.boolean(),
  webhookUrl: z.string().url().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = importSchema.parse(body);

    // Create new SLA in database
    const newSla = await db.insert(sla).values({
      userId,
      name: validatedData.name,
      description: validatedData.description || null,
      warningThreshold: validatedData.warningThreshold,
      criticalThreshold: validatedData.criticalThreshold,
      enableNotifications: validatedData.enableNotifications,
      emailNotifications: validatedData.emailNotifications,
      webhookNotifications: validatedData.webhookNotifications,
      webhookUrl: validatedData.webhookUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "SLA imported successfully" }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: err.errors,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
