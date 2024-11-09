import { cn } from "@/utils"
import { HTMLAttributes, ReactNode } from "react"

/**
 * Props for the Heading component
 */
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Content to be rendered inside the heading */
  children?: ReactNode
}

/**
 * Heading component
 *
 * - Renders a styled `<h1>` heading element.
 * - Supports additional classes through `className` and other HTML heading attributes via `props`.
 *
 * @param children - Content to display inside the heading.
 * @param className - Additional CSS classes for custom styling.
 * @param props - Additional HTML attributes for the heading element.
 * @returns A styled h1 heading element.
 */
export const Heading = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
