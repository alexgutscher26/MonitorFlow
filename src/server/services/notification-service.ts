import { db } from "@/db"
import { sendEmail, generateSLANotificationEmail } from "@/lib/email"
import type {
  SLADefinition,
  SLANotification,
  NotificationType,
} from "@prisma/client"

export class NotificationService {
  static async createNotification(
    slaDefinition: SLADefinition,
    type: NotificationType,
    message: string
  ) {
    const notification = await db.sLANotification.create({
      data: {
        slaDefinitionId: slaDefinition.id,
        type,
        message,
      },
    })

    // Handle different notification channels
    try {
      if (slaDefinition.emailNotifications) {
        await this.sendEmailNotification(notification, slaDefinition)
      }

      if (slaDefinition.webhookNotifications && slaDefinition.webhookUrl) {
        await this.sendWebhookNotification(
          notification,
          slaDefinition.webhookUrl
        )
      }

      // Update notification status to delivered
      await db.sLANotification.update({
        where: { id: notification.id },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
      })
    } catch (error) {
      // Update notification with error
      await db.sLANotification.update({
        where: { id: notification.id },
        data: {
          status: "FAILED",
          error:
            error instanceof Error
              ? error.message
              : "Failed to send notification",
        },
      })

      throw error
    }

    return notification
  }

  private static async sendEmailNotification(
    notification: SLANotification,
    slaDefinition: SLADefinition
  ) {
    // Get user's email from the database
    const user = await db.user.findUnique({
      where: { id: slaDefinition.userId },
      select: { email: true },
    })

    if (!user?.email) {
      throw new Error("User email not found")
    }

    // Generate email content
    const { subject, html } = generateSLANotificationEmail(
      notification.type,
      notification.message,
      slaDefinition.name
    )

    // Send the email
    await sendEmail({
      to: user.email,
      subject,
      html,
    })
  }

  private static async sendWebhookNotification(
    notification: SLANotification,
    webhookUrl: string
  ) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: notification.type,
        message: notification.message,
        createdAt: notification.createdAt,
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`)
    }
  }
}
