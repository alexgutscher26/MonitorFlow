import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import { db } from "@/db";
import { DiscordClient } from "@/lib/discord-client";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schema for request validation
const REQUEST_VALIDATOR = z
  .object({
    category: CATEGORY_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

/**
 * Handles incoming POST requests for event processing.
 *
 * Authenticates the request, checks user quota, validates the payload,
 * and sends an event notification to the user's Discord.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} The response object containing the result.
 */
export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization");

    // Authorization checks
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid authorization header format" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.split(" ")[1]?.trim();
    if (!apiKey) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    }

    // Fetch user by API key
    const user = await db.user.findUnique({
      where: { apiKey },
      include: { EventCategories: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    }

    if (!user.discordId) {
      return NextResponse.json(
        { message: "Please enter your Discord ID in your account settings" },
        { status: 403 }
      );
    }

    // Monthly quota check
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const quotaLimit =
      user.plan === "FREE" ? FREE_QUOTA.maxEventsPerMonth : PRO_QUOTA.maxEventsPerMonth;

    const quota = await db.quota.findUnique({
      where: { userId: user.id, month: currentMonth, year: currentYear },
    });

    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        { message: "Monthly quota reached. Upgrade your plan for more events." },
        { status: 429 }
      );
    }

    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
    const dmChannel = await discord.createDM(user.discordId);

    // Parse and validate request body
    let requestData;
    try {
      requestData = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData);

    // Verify category
    const category = user.EventCategories.find(
      (cat) => cat.name === validationResult.category
    );
    if (!category) {
      return NextResponse.json(
        { message: `Category "${validationResult.category}" not found.` },
        { status: 404 }
      );
    }

    // Prepare event data for the Discord notification
    const eventData = {
      title: `${category.emoji || "🔔"} ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}`,
      description: validationResult.description || `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(([key, value]) => ({
        name: key,
        value: String(value),
        inline: true,
      })),
    };

    // Store the event in the database
    const event = await db.event.create({
      data: {
        name: category.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.fields || {},
        eventCategoryId: category.id,
      },
    });

    // Attempt to send the notification to Discord
    try {
      await discord.sendEmbed(dmChannel.id, eventData);

      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "DELIVERED" },
      });

      // Update or create quota record
      await db.quota.upsert({
        where: { userId: user.id, month: currentMonth, year: currentYear },
        update: { count: { increment: 1 } },
        create: { userId: user.id, month: currentMonth, year: currentYear, count: 1 },
      });
    } catch (err) {
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "FAILED" },
      });

      console.error("Error sending event to Discord:", err);
      return NextResponse.json(
        { message: "Error processing event", eventId: event.id },
        { status: 500 }
      );
    }

    // Successfully processed event
    return NextResponse.json({
      message: "Event processed successfully",
      eventId: event.id,
    });
  } catch (err) {
    console.error("Unexpected error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", details: err.errors },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
