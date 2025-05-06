import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Domain parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Find the user with this custom domain
    const user = await db.user.findFirst({
      where: { brandCustomDomain: domain },
      select: {
        id: true,
        brandLogo: true,
        brandPrimaryColor: true,
        brandSecondaryColor: true,
        brandCustomDomain: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No branding found for this domain" },
        { status: 404 }
      );
    }

    // Return the branding settings in the same format as the project.getBranding endpoint
    return NextResponse.json({
      logo: user.brandLogo,
      primaryColor: user.brandPrimaryColor,
      secondaryColor: user.brandSecondaryColor,
      customDomain: user.brandCustomDomain,
    });
  } catch (error) {
    console.error("Error fetching branding by domain:", error);
    return NextResponse.json(
      { error: "Failed to fetch branding settings" },
      { status: 500 }
    );
  }
}