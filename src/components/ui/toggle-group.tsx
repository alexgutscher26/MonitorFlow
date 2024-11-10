"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/utils"

/**
 * Context to provide variant and size options to `ToggleGroupItem` components within `ToggleGroup`.
 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
})

/**
 * ToggleGroup component
 * 
 * - A grouping component for multiple toggle buttons that allows selection of one or more options.
 * - Accepts `variant` and `size` props for consistent styling of child `ToggleGroupItem` components.
 * 
 * @param variant - The styling variant for toggles within the group (default or outline).
 * @param size - The size of toggles within the group (default, sm, or lg).
 * @param className - Additional CSS classes for custom styling.
 * @param children - The toggle items within the group.
 * @param props - Additional properties from ToggleGroupPrimitive.Root.
 * @returns A JSX element representing a toggle button group.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant = "default", size = "default", children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

/**
 * ToggleGroupItem component
 * 
 * - An individual toggle button within a `ToggleGroup`.
 * - Inherits `variant` and `size` values from `ToggleGroupContext` if not explicitly provided.
 * 
 * @param variant - Optional variant to override inherited variant style.
 * @param size - Optional size to override inherited size style.
 * @param className - Additional CSS classes for custom styling.
 * @param children - The content inside the toggle item.
 * @param props - Additional properties from ToggleGroupPrimitive.Item.
 * @returns A JSX element representing a toggle button within the group.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: variant || context.variant,
          size: size || context.size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
