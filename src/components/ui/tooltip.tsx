"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/utils"

/**
 * TooltipProvider component
 * 
 * - Provides context for the Tooltip component, managing open/close state for nested tooltips.
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * Tooltip component
 * 
 * - Wrapper component that represents a single tooltip instance.
 */
const Tooltip = TooltipPrimitive.Root

/**
 * TooltipTrigger component
 * 
 * - Element that triggers the tooltip when hovered or focused.
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * TooltipContent component
 * 
 * - Displays the tooltip content with animations and custom styling.
 * - Supports props such as `sideOffset` for adjusting the tooltip's position relative to the trigger.
 * 
 * @param className - Additional CSS classes for custom styling.
 * @param sideOffset - Offset for positioning the tooltip from the trigger (default: 4).
 * @param props - Additional properties from TooltipPrimitive.Content.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
