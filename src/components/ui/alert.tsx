import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

// Define alert variants for styling
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Define AlertProps, extending HTML div attributes with variant types
interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * Alert Component
 *
 * Displays an alert message with customizable styles and an optional icon. Supports
 * "default" and "destructive" variants for different alert types.
 *
 * @param {AlertProps} props - Alert properties including variant and custom styling.
 * @returns {JSX.Element} The Alert component.
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

/**
 * AlertTitle Component
 *
 * Renders the title of the alert, typically displayed in bold font at the top.
 *
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Title properties.
 * @returns {JSX.Element} The AlertTitle component.
 */
const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription Component
 *
 * Displays the descriptive content of the alert. Supports nested paragraph elements for readability.
 *
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Description properties.
 * @returns {JSX.Element} The AlertDescription component.
 */
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
