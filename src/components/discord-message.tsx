import { cn } from "@/utils"
import { Clock } from "lucide-react"
import Image from "next/image"

/**
 * Props for the DiscordMessage component
 */
interface DiscordMessageProps {
  /** URL source for the avatar image */
  avatarSrc: string
  /** Alt text for the avatar image */
  avatarAlt: string
  /** Username displayed for the message sender */
  username: string
  /** Timestamp for when the message was sent */
  timestamp: string
  /** Optional badge text displayed on the message */
  badgeText?: string
  /** Optional badge color in hex or color name format */
  badgeColor?: BadgeColor
  /** Title of the message */
  title: string
  /** Message content as key-value pairs */
  content: Record<string, string>
}

/** Supported badge colors */
type BadgeColor = "#43b581" | "#faa61a" | (string & {})

/**
 * Retrieves styling classes based on the badge color.
 *
 * @param color - The color code for the badge.
 * @returns Corresponding Tailwind CSS classes for the badge style.
 */
const getBadgeStyles = (color: BadgeColor) => {
  switch (color) {
    case "#43b581":
      return "bg-green-500/10 text-green-400 ring-green-500/20"
    case "#faa61a":
      return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 ring-gray-500/20"
  }
}

/**
 * DiscordMessage component
 *
 * - Mimics a styled Discord message with avatar, title, and content fields.
 * - Displays an optional badge and a timestamp at the bottom.
 *
 * @param props - The properties for the message, including avatar, title, content, etc.
 * @returns A JSX element styled like a Discord message.
 */
export const DiscordMessage = ({
  avatarAlt,
  avatarSrc,
  content,
  timestamp,
  title,
  username,
  badgeColor = "#43b581",
  badgeText,
}: DiscordMessageProps) => {
  return (
    <div className="w-full flex items-start">
      <div className="flex items-center mb-2">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          width={40}
          height={40}
          className="object-cover rounded-full mr-3"
        />
      </div>

      <div className="w-full max-w-xl">
        {/* Header with username, badge, and timestamp */}
        <div className="flex items-center">
          <p className="font-semibold text-white">{username}</p>
          <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-brand-600 text-white rounded">
            APP
          </span>
          <span className="text-gray-400 ml-1.5 text-xs font-normal">
            {timestamp}
          </span>
        </div>

        {/* Message content area with optional badge and title */}
        <div className="bg-[#2f3136] text-sm w-full rounded p-3 mb-4 mt-1.5">
          <div className="flex items-center justify-between mb-2">
            {badgeText && (
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  getBadgeStyles(badgeColor)
                )}
              >
                {badgeText}
              </span>
            )}
            <p className="text-white text-base/7 font-semibold">
              {title}
            </p>
          </div>

          {/* Content rendered as key-value pairs */}
          {Object.entries(content).map(([key, value]) => (
            <p key={key} className="text-[#dcddde] text-sm/6">
              <span className="text-[#b9bbbe]">{key}:</span> {value}
            </p>
          ))}

          {/* Timestamp with icon */}
          <p className="text-[#72767d] text-xs mt-2 flex items-center">
            <Clock className="size-3 mr-1" />
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}
