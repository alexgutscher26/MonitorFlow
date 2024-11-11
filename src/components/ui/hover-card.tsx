"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/utils";

/** 
 * Root component for the HoverCard, which serves as the main container.
 */
const HoverCard = HoverCardPrimitive.Root;

/** 
 * Trigger component for HoverCard, which opens the card on hover.
 */
const HoverCardTrigger = HoverCardPrimitive.Trigger;

/**
 * Content component for displaying the content inside the HoverCard.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for custom styling.
 * @param {"center" | "start" | "end"} [props.align="center"] - Alignment of the content relative to the trigger.
 * @param {number} [props.sideOffset=4] - Offset distance from the trigger element.
 * @param {React.Ref} ref - Forwarded ref for the content element.
 * @returns {JSX.Element} Rendered HoverCard content.
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
