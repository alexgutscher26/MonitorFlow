import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { analytics, marketing } = body;

    // Update or create user consent preferences
    const consent = await db.userConsent.upsert({
      where: { userId },
      create: {
        userId,
        analytics,
        marketing,
      },
      update: {
        analytics,
        marketing,
      },
    });

    return NextResponse.json(consent);
  } catch (error) {
    console.error('[USER_CONSENT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const consent = await db.userConsent.findUnique({
      where: { userId },
    });

    return NextResponse.json(consent || {
      analytics: false,
      marketing: false,
    });
  } catch (error) {
    console.error('[USER_CONSENT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}