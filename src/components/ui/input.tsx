import { cn } from "@/utils";
import * as React from "react";

/**
 * Props for the Input component, extending standard input attributes.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component that provides a styled input field with configurable props.
 * 
 * @param {InputProps} props - Component props for configuring the input field.
 * @param {string} [props.className] - Additional class names for custom styling.
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref to the input element.
 * @returns {JSX.Element} Rendered Input component.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
