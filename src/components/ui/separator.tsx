"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/utils";

/**
 * Separator component for visually dividing content. Supports both horizontal and vertical orientations.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {"horizontal" | "vertical"} [props.orientation="horizontal"] - The orientation of the separator
 * @param {boolean} [props.decorative=true] - Whether the separator is purely decorative (non-accessible)
 * @returns {JSX.Element} Rendered Separator component
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
