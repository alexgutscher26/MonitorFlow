import { cn } from "@/utils"
import { ReactNode } from "react"

/**
 * Props for MaxWidthWrapper component.
 */
interface MaxWidthWrapperProps {
  /** Optional additional CSS classes for custom styling */
  className?: string
  /** Content to be rendered within the wrapper */
  children: ReactNode
}

/**
 * MaxWidthWrapper component
 * 
 * - Provides a responsive container with a maximum width of `max-w-screen-xl`.
 * - Includes horizontal padding that adjusts based on screen size.
 * 
 * @param className - Optional CSS classes for additional styling.
 * @param children - Elements to be rendered within the container.
 * @returns A responsive wrapper component that limits the maximum width of its content.
 */
export const MaxWidthWrapper = ({
  className,
  children,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  )
}
