import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils"; // Ensure you import the cn utility function

// Define badge variants with CVA
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// BadgeProps extends standard HTML div properties and CVA variant types
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge Component
 *
 * Renders a styled badge with configurable color variants and additional styling options.
 *
 * @param {BadgeProps} props - Properties for configuring badge appearance.
 * @returns {JSX.Element} The rendered badge component.
 */
function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
