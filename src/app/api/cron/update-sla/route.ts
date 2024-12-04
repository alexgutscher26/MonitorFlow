import { NextResponse } from "next/server";
import { updateSLAMeasurements } from "@/lib/sla";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    // Verify cron secret if needed
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await updateSLAMeasurements();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating SLA measurements:", error);
    return NextResponse.json(
      { error: "Failed to update SLA measurements" },
      { status: 500 }
    );
  }
}
