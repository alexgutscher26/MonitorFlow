import { type Alert } from '@prisma/client';
import { db } from '@/db';
import { analyzePriority } from '@/lib/ai-priority';
import { sendDiscordNotification } from './discord-service';

export async function processAlert(
  alertData: Pick<Alert, 'title' | 'message' | 'type' | 'metadata'>
) {
  // Get historical context for AI analysis
  const historicalContext = await getHistoricalContext(alertData);

  // Analyze priority using AI
  const priorityAnalysis = await analyzePriority(alertData, historicalContext);

  // Create alert with AI-determined priority
  const alert = await db.alert.create({
    data: {
      ...alertData,
      priority: priorityAnalysis.level,
      priorityConfidence: priorityAnalysis.confidence,
      priorityReasoning: priorityAnalysis.reasoning,
    },
  });

  // Send notification with priority information
  await sendDiscordNotification({
    ...alert,
    priorityAnalysis,
  });

  return alert;
}

async function getHistoricalContext(alert: Pick<Alert, 'type'>) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [recentAlerts, similarAlerts] = await Promise.all([
    db.alert.count({
      where: {
        createdAt: {
          gte: oneHourAgo,
        },
      },
    }),
    db.alert.findMany({
      where: {
        type: alert.type,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    }),
  ]);

  // Calculate average resolution time if available
  const resolvedAlerts = similarAlerts.filter((a) => a.resolvedAt);
  const averageResolutionTime = resolvedAlerts.length
    ? resolvedAlerts.reduce((acc, curr) => {
        return (
          acc +
          (curr.resolvedAt!.getTime() - curr.createdAt.getTime()) / 1000 / 60
        );
      }, 0) / resolvedAlerts.length
    : undefined;

  return {
    recentAlertCount: recentAlerts,
    similarIncidentsLast24h: similarAlerts.length,
    averageResolutionTime,
  };
}
