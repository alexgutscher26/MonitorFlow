import { cn } from "@/utils"
import * as React from "react"

/**
 * Props for the Textarea component.
 * 
 * - Extends the standard HTML attributes for a `<textarea>` element.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea component
 * 
 * - A customizable textarea element with default styling.
 * - Supports all standard HTML textarea attributes via props.
 *
 * @param className - Additional CSS classes for custom styling.
 * @param ref - React ref forwarded to the underlying textarea element.
 * @returns A styled textarea element.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
