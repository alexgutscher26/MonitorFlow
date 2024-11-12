"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils"; // Import the cn utility function

/**
 * Avatar Component
 *
 * Renders an avatar container with optional image and fallback components.
 * Provides a customizable profile image with Radix Avatar primitive support.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>} props - Avatar properties for customization.
 * @returns {JSX.Element} The Avatar component.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * AvatarImage Component
 *
 * Renders the image within the Avatar container. If the image fails to load,
 * the AvatarFallback component will be displayed.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>} props - AvatarImage properties.
 * @returns {JSX.Element} The AvatarImage component.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * AvatarFallback Component
 *
 * Renders fallback content when the AvatarImage is not available.
 * Often used for displaying initials or a placeholder icon.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>} props - AvatarFallback properties.
 * @returns {JSX.Element} The AvatarFallback component.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
