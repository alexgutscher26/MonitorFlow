"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

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
 * RadioGroup component to render a group of radio buttons with accessible layout.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling.
 * @returns {JSX.Element} Rendered RadioGroup component.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * RadioGroupItem component representing an individual radio button.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling.
 * @returns {JSX.Element} Rendered RadioGroupItem component with an indicator.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <CheckIcon className="h-3.5 w-3.5 fill-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
