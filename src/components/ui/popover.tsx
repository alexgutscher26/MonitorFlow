"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

/**
 * Utility function to concatenate class names conditionally.
 *
 * @param {string} baseClass - Required base class name.
 * @param {string | undefined} additionalClass - Additional class name if provided.
 * @returns {string} Combined class name.
 */
function cn(baseClass: string, additionalClass?: string): string {
  return additionalClass ? `${baseClass} ${additionalClass}` : baseClass;
}

/**
 * Popover root component to manage popover state and behaviors.
 */
const Popover = PopoverPrimitive.Root;

/**
 * Popover trigger component that opens the popover when clicked.
 */
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Popover anchor component for positioning the popover relative to another element.
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Popover content component for displaying the content of the popover.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling.
 * @param {"center" | "start" | "end"} [props.align="center"] - Alignment of the popover content.
 * @param {number} [props.sideOffset=4] - Offset distance from the anchor.
 * @returns {JSX.Element} Rendered PopoverContent component.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
