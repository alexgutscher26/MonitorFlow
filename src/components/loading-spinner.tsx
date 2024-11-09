import { cva, VariantProps } from "class-variance-authority"

/**
 * Variants for the loading spinner using CVA
 * - Defines spinner size and color variants.
 */
const spinnerVariants = cva(
  "border-4 rounded-full border-brand-200 border-t-brand-700 animate-spin duration-700",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-4",
        lg: "size-8 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/**
 * Props for LoadingSpinner component.
 */
interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  /** Optional additional classes for custom styling */
  className?: string
}

/**
 * LoadingSpinner component
 * 
 * - Renders a loading spinner with size variants (sm, md, lg).
 * - Accepts an optional `className` for additional styling.
 *
 * @param size - The size of the spinner (sm, md, lg).
 * @param className - Additional CSS classes for custom styling.
 * @returns A JSX element representing a loading spinner.
 */
export const LoadingSpinner = ({ size, className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerVariants({ size, className })} />
    </div>
  )
}
