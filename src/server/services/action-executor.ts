import { db } from "@/db"
import { ActionType, Event, IncidentAction } from "@prisma/client"
import { isAfter, addMinutes } from "date-fns"

export class ActionExecutor {
  private static async shouldExecute(action: IncidentAction, event: Event): Promise<boolean> {
    // Check if action is enabled
    if (!action.enabled) {
      return false
    }

    // Check cooldown
    if (action.lastTriggered && action.cooldownMinutes > 0) {
      const cooldownEnd = addMinutes(action.lastTriggered, action.cooldownMinutes)
      if (isAfter(new Date(), cooldownEnd) === false) {
        return false
      }
    }

    // Check conditions
    try {
      const conditions = action.conditions as Record<string, any>
      const eventFields = event.fields as Record<string, any>

      for (const [field, condition] of Object.entries(conditions)) {
        const eventValue = eventFields[field]
        if (!eventValue) return false

        switch (condition.operator) {
          case "equals":
            if (eventValue !== condition.value) return false
            break
          case "contains":
            if (!String(eventValue).includes(String(condition.value))) return false
            break
          case "gt":
            if (Number(eventValue) <= Number(condition.value)) return false
            break
          case "lt":
            if (Number(eventValue) >= Number(condition.value)) return false
            break
          default:
            console.warn(`Unknown condition operator: ${condition.operator}`)
            return false
        }
      }

      return true
    } catch (error) {
      console.error("Error checking conditions:", error)
      return false
    }
  }

  private static async executeDiscordNotification(action: IncidentAction, event: Event) {
    const config = action.config as { webhookUrl?: string; message?: string }
    if (!config.webhookUrl) {
      throw new Error("Discord webhook URL not configured")
    }

    const message = config.message || "Incident detected!"
    
    try {
      const response = await fetch(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          embeds: [
            {
              title: "Incident Details",
              fields: [
                {
                  name: "Event Category",
                  value: event.eventCategoryId || "Unknown",
                  inline: true,
                },
                {
                  name: "Event Message",
                  value: event.formattedMessage,
                  inline: false,
                },
              ],
              color: 0xff0000,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`)
      }

      return "Discord notification sent successfully"
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to send Discord notification: ${errorMessage}`)
    }
  }

  private static async executeWebhook(action: IncidentAction, event: Event) {
    const config = action.config as { url?: string; method?: string; headers?: Record<string, string> }
    if (!config.url) {
      throw new Error("Webhook URL not configured")
    }

    try {
      const response = await fetch(config.url, {
        method: config.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.headers || {}),
        },
        body: JSON.stringify({
          action: action.name,
          event: {
            id: event.id,
            category: event.eventCategoryId,
            message: event.formattedMessage,
            fields: event.fields,
          },
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`)
      }

      return "Webhook executed successfully"
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to execute webhook: ${errorMessage}`)
    }
  }

  private static async executeEmail(action: IncidentAction, event: Event) {
    // Note: Implement email sending logic here using your preferred email service
    // For example: SendGrid, Amazon SES, etc.
    return "Email notification not implemented yet"
  }

  private static async executeRetryCheck(action: IncidentAction, event: Event) {
    // Implement retry logic here
    return "Retry check executed"
  }

  private static async executePauseMonitoring(action: IncidentAction, event: Event) {
    // Implement monitoring pause logic here
    return "Monitoring paused"
  }

  public static async execute(action: IncidentAction, event: Event) {
    // Create action log entry
    const actionLog = await db.incidentActionLog.create({
      data: {
        actionId: action.id,
        eventId: event.id,
        status: "IN_PROGRESS",
      },
    })

    try {
      // Check if we should execute the action
      const shouldExecute = await this.shouldExecute(action, event)
      if (!shouldExecute) {
        await db.incidentActionLog.update({
          where: { id: actionLog.id },
          data: {
            status: "COMPLETED",
            result: "Action skipped due to conditions or cooldown",
            completedAt: new Date(),
          },
        })
        return
      }

      // Execute the action based on type
      let result: string
      switch (action.actionType) {
        case "DISCORD_NOTIFICATION":
          result = await this.executeDiscordNotification(action, event)
          break
        case "WEBHOOK":
          result = await this.executeWebhook(action, event)
          break
        case "EMAIL":
          result = await this.executeEmail(action, event)
          break
        case "RETRY_CHECK":
          result = await this.executeRetryCheck(action, event)
          break
        case "PAUSE_MONITORING":
          result = await this.executePauseMonitoring(action, event)
          break
        default:
          throw new Error(`Unknown action type: ${action.actionType}`)
      }

      // Update action's last triggered time
      await db.incidentAction.update({
        where: { id: action.id },
        data: { lastTriggered: new Date() },
      })

      // Update action log
      await db.incidentActionLog.update({
        where: { id: actionLog.id },
        data: {
          status: "COMPLETED",
          result,
          completedAt: new Date(),
        },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error(`Error executing action ${action.name}:`, error)
      await db.incidentActionLog.update({
        where: { id: actionLog.id },
        data: {
          status: "FAILED",
          error: errorMessage,
          completedAt: new Date(),
        },
      })
    }
  }
}
