import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

/**
 * Card Component
 *
 * Provides a styled card layout with customizable inner content padding and additional styling options.
 *
 * @param {CardProps} props - The props for the Card component.
 * @returns {JSX.Element} The Card component with children rendered inside.
 */
export const Card = ({
  className,
  contentClassName,
  children,
  ...props
}: CardProps): JSX.Element => {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-gray-50 text-card-foreground",
        className
      )}
      {...props}
    >
      {/* Main content area with padding and customizable class */}
      <div className={cn("relative z-10 p-6", contentClassName)}>
        {children}
      </div>
      
      {/* Background layers for depth and shadow */}
      <div className="absolute inset-px rounded-lg bg-white z-0" />
      <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 z-0" />
    </div>
  );
};
