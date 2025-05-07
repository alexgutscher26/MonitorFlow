import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AuditService } from '@/server/services/audit-service';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') as 'csv' | 'json' || 'json';
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const resource = searchParams.get('resource') || undefined;
    const action = searchParams.get('action') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    if (format === 'csv') {
      const csv = await AuditService.exportAuditLogs(userId, 'csv');
      return new NextResponse(csv as BodyInit, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=audit-logs.csv',
        },
      });
    }

    const logs = await AuditService.getAuditLogs(userId, {
      startDate,
      endDate,
      resource,
      action,
      limit,
      offset,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}