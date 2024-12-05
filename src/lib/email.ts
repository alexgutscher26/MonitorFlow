import { Resend } from "resend"

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

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
    const data = await resend.emails.send({
      from: "PingPanda <notifications@pingpanda.dev>",
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export const generateSLANotificationEmail = (
  type: "WARNING" | "CRITICAL" | "RECOVERY",
  message: string,
  slaName: string
) => {
  const typeColors = {
    WARNING: "#FFA500",
    CRITICAL: "#FF0000",
    RECOVERY: "#00FF00",
  }

  const color = typeColors[type]
  const title = `${type} Alert for ${slaName}`

  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background: ${color};
              color: white;
              padding: 20px;
              border-radius: 5px 5px 0 0;
              text-align: center;
            }
            .content {
              padding: 20px;
              border: 1px solid #eee;
              border-radius: 0 0 5px 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>This is an automated message from PingPanda. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `,
  }
}
