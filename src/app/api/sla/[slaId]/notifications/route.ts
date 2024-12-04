import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { slaId: string } }
) {
  try {
    // Try API key auth first
    const authHeader = request.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      // API key authentication
      if (!authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'",
          },
          { status: 401 }
        );
      }

      const apiKey = authHeader.split(" ")[1];
      if (!apiKey || apiKey.trim() === "") {
        return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
      }

      const user = await db.user.findUnique({
        where: { apiKey }
      });

      if (!user) {
        return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
      }

      userId = user.id;
    } else {
      // Browser authentication using Clerk
      const { userId: clerkUserId } = await auth();
      if (!clerkUserId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Find the user in our database using Clerk's external ID
      const user = await db.user.findUnique({
        where: { externalId: clerkUserId }
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 401 });
      }

      userId = user.id;
    }

    // First verify the SLA belongs to the user
    const slaDefinition = await db.sLADefinition.findFirst({
      where: {
        AND: [
          { id: params.slaId },
          { userId }
        ]
      }
    });

    if (!slaDefinition) {
      return new NextResponse("SLA not found", { status: 404 });
    }

    // Fetch notifications for this SLA
    const notifications = await db.sLANotification.findMany({
      where: {
        slaDefinitionId: params.slaId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
