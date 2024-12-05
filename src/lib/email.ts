import { Resend } from "resend"
import { z } from "zod"
import { rateLimit } from "@/utils/rate-limit"

// Email validation schema
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  html: z.string().min(1),
})

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiter: 100 emails per hour
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  maxRequests: 100,
})

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    // Validate email parameters
    emailSchema.parse({ to, subject, html })

    // Check rate limit
    await limiter.check()

    // Retry logic with exponential backoff
    let lastError: Error | null = null
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const { data } = await resend.emails.send({
          from: "PingPanda <notifications@pingpanda.dev>",
          to,
          subject,
          html,
          tags: [{ name: "category", value: "notification" }],
        })

        console.info("Email sent successfully:", {
          to,
          subject,
          emailId: data?.id,
          timestamp: new Date().toISOString(),
        })

        return { success: true, data }
      } catch (error) {
        lastError = error as Error
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
          )
        }
      }
    }

    // If all retries failed
    console.error("All retry attempts failed:", {
      to,
      subject,
      error: lastError,
      timestamp: new Date().toISOString(),
    })

    throw lastError
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Email validation failed:", {
        to,
        subject,
        errors: error.errors,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error("Error sending email:", {
        to,
        subject,
        error,
        timestamp: new Date().toISOString(),
      })
    }
    throw error
  }
}

export const generateSLANotificationEmail = (
  type: "WARNING" | "CRITICAL" | "RECOVERY",
  message: string,
  slaName: string,
  details?: {
    currentUptime?: number
    threshold?: number
    timestamp?: string
  }
) => {
  const typeColors = {
    WARNING: "#FFA500",
    CRITICAL: "#FF0000",
    RECOVERY: "#00FF00",
  }

  const typeIcons = {
    WARNING: "⚠️",
    CRITICAL: "🚨",
    RECOVERY: "✅",
  }

  const color = typeColors[type]
  const icon = typeIcons[type]
  const title = `${icon} ${type} Alert for ${slaName}`

  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
              background: #f9fafb;
            }
            .header {
              background: ${color};
              color: white;
              padding: 24px;
              border-radius: 8px 8px 0 0;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .content {
              padding: 24px;
              background: white;
              border: 1px solid #eee;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #374151;
            }
            .details {
              margin-top: 20px;
              padding: 16px;
              background: #f3f4f6;
              border-radius: 6px;
            }
            .details-item {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 14px;
              color: #4b5563;
            }
            .footer {
              text-align: center;
              margin-top: 24px;
              padding: 16px;
              color: #6b7280;
              font-size: 13px;
              border-top: 1px solid #eee;
            }
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
              .header, .content {
                padding: 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0;font-size:24px;">${title}</h1>
          </div>
          <div class="content">
            <div class="message">
              ${message}
            </div>
            ${
              details
                ? `
              <div class="details">
                ${
                  details.currentUptime
                    ? `
                  <div class="details-item">
                    <span>Current Uptime:</span>
                    <strong>${details.currentUptime.toFixed(2)}%</strong>
                  </div>
                `
                    : ""
                }
                ${
                  details.threshold
                    ? `
                  <div class="details-item">
                    <span>Threshold:</span>
                    <strong>${details.threshold}%</strong>
                  </div>
                `
                    : ""
                }
                ${
                  details.timestamp
                    ? `
                  <div class="details-item">
                    <span>Timestamp:</span>
                    <strong>${new Date(details.timestamp).toLocaleString()}</strong>
                  </div>
                `
                    : ""
                }
              </div>
            `
                : ""
            }
          </div>
          <div class="footer">
            <p style="margin:0;">This is an automated message from MonitorFlow. Please do not reply to this email.</p>
            <p style="margin:8px 0 0;">
              <a href="https://monitorflow.com/dashboard" style="color:#2563eb;text-decoration:none;">
                View Dashboard
              </a>
            </p>
          </div>
        </body>
      </html>
    `,
  }
}
