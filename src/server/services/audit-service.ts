import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
}

export class AuditService {
  static async log(entry: AuditLogEntry) {
    const headersList = headers();
    
    return prisma.auditLog.create({
      data: {
        ...entry,
        ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
        userAgent: headersList.get('user-agent'),
      },
    });
  }

  static async getAuditLogs(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    resource?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }) {
    const where = {
      userId,
      ...(options?.resource && { resource: options.resource }),
      ...(options?.action && { action: options.action }),
      ...(options?.startDate && options?.endDate && {
        createdAt: {
          gte: options.startDate,
          lte: options.endDate,
        },
      }),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: options?.offset || 0,
        take: options?.limit || 50,
      }),
    ]);

    return { total, logs };
  }

  static async exportAuditLogs(userId: string, format: 'csv' | 'json' = 'json') {
    const logs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const headers = ['id', 'action', 'resource', 'resourceId', 'details', 'ipAddress', 'userAgent', 'createdAt'];
      const rows = logs.map(log => [
        log.id,
        log.action,
        log.resource,
        log.resourceId || '',
        JSON.stringify(log.details || ''),
        log.ipAddress || '',
        log.userAgent || '',
        log.createdAt.toISOString(),
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csv;
    }

    return logs;
  }
}