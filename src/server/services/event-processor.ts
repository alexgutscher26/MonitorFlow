import { type User } from '@prisma/client';
import { db } from '@/db';
import { analyzePriority } from '@/lib/ai-priority';
import { sendDiscordNotification } from './discord-service';

export type EventType = 
  | 'sale' 
  | 'user' 
  | 'subscription' 
  | 'support' 
  | 'system' 
  | 'security' 
  | 'performance' 
  | 'custom';

export type BaseEvent = {
  type: EventType;
  action: string;
  data: Record<string, any>;
  userId: string;
  customPriority?: 'critical' | 'high' | 'medium' | 'low';
  notificationPreferences?: {
    silent?: boolean;
    mentionRoles?: string[];
    threadCreation?: boolean;
    customEmoji?: string;
    customColor?: string;
  };
};

export type SaleEvent = BaseEvent & {
  type: 'sale';
  data: {
    amount: number;
    currency: string;
    productName: string;
    customerType: 'new' | 'existing';
    subscriptionType?: 'monthly' | 'annual' | 'lifetime';
    paymentMethod?: string;
    customerSegment?: string;
    region?: string;
  };
};

export type UserEvent = BaseEvent & {
  type: 'user';
  data: {
    userId: string;
    action: 'signup' | 'login' | 'upgrade' | 'downgrade' | 'churn' | 'reactivation';
    userType?: 'free' | 'pro' | 'enterprise';
    previousPlan?: string;
    newPlan?: string;
    userMetadata?: {
      company?: string;
      industry?: string;
      teamSize?: number;
      region?: string;
    };
  };
};

export type SubscriptionEvent = BaseEvent & {
  type: 'subscription';
  data: {
    subscriptionId: string;
    action: 'created' | 'renewed' | 'cancelled' | 'failed' | 'updated';
    plan: string;
    amount: number;
    currency: string;
    billingPeriod: 'monthly' | 'annual';
    nextBillingDate?: string;
    cancellationReason?: string;
  };
};

export type SupportEvent = BaseEvent & {
  type: 'support';
  data: {
    ticketId: string;
    status: 'opened' | 'replied' | 'resolved' | 'escalated';
    category: string;
    priority?: string;
    responseTime?: number;
    customerSatisfaction?: number;
  };
};

export type SecurityEvent = BaseEvent & {
  type: 'security';
  data: {
    eventType: 'login_attempt' | 'password_change' | 'api_key_rotation' | 'suspicious_activity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    ipAddress?: string;
    location?: string;
    userAgent?: string;
  };
};

export type SystemEvent = BaseEvent & {
  type: 'system';
  data: {
    component: string;
    status: 'healthy' | 'degraded' | 'down';
    metrics?: {
      latency?: number;
      errorRate?: number;
      resourceUsage?: number;
    };
  };
};

export type SaasEvent = 
  | SaleEvent 
  | UserEvent 
  | SubscriptionEvent 
  | SupportEvent 
  | SecurityEvent 
  | SystemEvent 
  | BaseEvent;

export async function processEvent(event: SaasEvent) {
  // Format the event message based on type
  const { title, message } = formatEventMessage(event);

  // Get user's Discord webhook
  const user = await db.user.findUnique({
    where: { id: event.userId },
    select: { discordId: true, plan: true }
  });

  if (!user?.discordId) {
    throw new Error('User Discord webhook not configured');
  }

  // Analyze priority using AI
  const priorityAnalysis = await analyzePriority({
    title,
    message,
    type: event.type,
    metadata: event.data
  });

  // Create event record
  const eventRecord = await db.event.create({
    data: {
      name: title,
      formattedMessage: message,
      fields: event.data,
      userId: event.userId,
      priority: priorityAnalysis.level,
      priorityConfidence: priorityAnalysis.confidence,
      priorityReasoning: priorityAnalysis.reasoning,
      eventCategoryId: await getEventCategory(event)
    }
  });

  // Send Discord notification with priority
  await sendDiscordNotification({
    webhookUrl: user.discordId,
    content: formatDiscordMessage(eventRecord, priorityAnalysis, event.notificationPreferences)
  });

  return eventRecord;
}

function formatEventMessage(event: SaasEvent): { title: string; message: string } {
  switch (event.type) {
    case 'sale':
      const saleEvent = event as SaleEvent;
      return {
        title: `New ${saleEvent.data.customerType} Sale: ${saleEvent.data.productName}`,
        message: `${saleEvent.data.amount} ${saleEvent.data.currency} - ${
          saleEvent.data.subscriptionType ? `Subscription: ${saleEvent.data.subscriptionType}` : 'One-time purchase'
        }`
      };

    case 'user':
      const userEvent = event as UserEvent;
      return {
        title: `User ${userEvent.data.action}: ${userEvent.data.userId}`,
        message: userEvent.data.newPlan
          ? `Plan change from ${userEvent.data.previousPlan} to ${userEvent.data.newPlan}`
          : `User type: ${userEvent.data.userType || 'free'}`
      };

    case 'subscription':
      const subscriptionEvent = event as SubscriptionEvent;
      return {
        title: `Subscription ${subscriptionEvent.data.action}: ${subscriptionEvent.data.subscriptionId}`,
        message: `${subscriptionEvent.data.plan} - ${subscriptionEvent.data.amount} ${subscriptionEvent.data.currency}`
      };

    case 'support':
      const supportEvent = event as SupportEvent;
      return {
        title: `Support Ticket ${supportEvent.data.status}: ${supportEvent.data.ticketId}`,
        message: `Category: ${supportEvent.data.category} - Priority: ${supportEvent.data.priority}`
      };

    case 'security':
      const securityEvent = event as SecurityEvent;
      return {
        title: `Security Event: ${securityEvent.data.eventType}`,
        message: `Severity: ${securityEvent.data.severity} - IP Address: ${securityEvent.data.ipAddress}`
      };

    case 'system':
      const systemEvent = event as SystemEvent;
      return {
        title: `System Event: ${systemEvent.data.component}`,
        message: `Status: ${systemEvent.data.status} - Metrics: ${JSON.stringify(systemEvent.data.metrics)}`
      };

    default:
      return {
        title: event.action,
        message: JSON.stringify(event.data)
      };
  }
}

async function getEventCategory(event: SaasEvent): Promise<string | null> {
  const category = await db.eventCategory.findFirst({
    where: {
      userId: event.userId,
      name: event.type
    }
  });
  return category?.id ?? null;
}

function formatDiscordMessage(event: any, priorityAnalysis: any, notificationPreferences?: any): string {
  const priorityEmoji = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  }[priorityAnalysis.level];

  let message = `
${priorityEmoji} **${event.name}**
${event.formattedMessage}

Priority: ${priorityAnalysis.level.toUpperCase()}
Reason: ${priorityAnalysis.reasoning}
  `.trim();

  if (notificationPreferences) {
    if (notificationPreferences.silent) {
      message = `**Silent Notification**\n${message}`;
    }

    if (notificationPreferences.mentionRoles) {
      message += `\nMention Roles: ${notificationPreferences.mentionRoles.join(', ')}`;
    }

    if (notificationPreferences.threadCreation) {
      message += `\nThread Creation: Enabled`;
    }

    if (notificationPreferences.customEmoji) {
      message = `${notificationPreferences.customEmoji} ${message}`;
    }

    if (notificationPreferences.customColor) {
      message = `<font color="${notificationPreferences.customColor}">${message}</font>`;
    }
  }

  return message;
}
