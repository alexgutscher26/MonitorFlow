"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress"; // Corrected module path
import { cn } from "@/utils";

/**
 * Progress component for displaying a progress bar with customizable value.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling.
 * @param {number} [props.value=0] - Progress value between 0 and 100.
 * @returns {JSX.Element} Rendered Progress component.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full bg-primary transition-all"
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
