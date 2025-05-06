import { cn } from "@/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnchorHTMLAttributes, forwardRef } from "react"

interface ShinyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  iconPosition?: "left" | "right"
  showIcon?: boolean
  isDisabled?: boolean
}

export const ShinyButton = forwardRef<HTMLAnchorElement, ShinyButtonProps>(
  (
    {
      className,
      children,
      href = "#",
      variant = "primary",
      size = "md",
      iconPosition = "right",
      showIcon = true,
      isDisabled = false,
      ...props
    },
    ref
  ) => {
    // Size-specific styles
    const sizeStyles = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2 text-base/7",
      lg: "px-8 py-2.5 text-lg",
    }

    // Variant-specific styles
    const variantStyles = {
      primary: "bg-brand-700 text-white border border-white hover:ring-brand-700",
      secondary: "bg-white text-brand-700 border border-brand-700 hover:ring-white",
      outline: "bg-transparent text-brand-700 border border-brand-700 hover:ring-brand-700",
    }

    // Icon component based on position
    const IconComponent = () => (
      <ArrowRight 
        className={cn(
          "size-4 shrink-0 transition-transform duration-300 ease-in-out",
          iconPosition === "right" ? "group-hover:translate-x-[2px]" : "group-hover:-translate-x-[2px]",
          variant !== "primary" && "text-brand-700"
        )} 
      />
    )

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md transition-all duration-300 hover:ring-2 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
          sizeStyles[size],
          variantStyles[variant],
          isDisabled && "cursor-not-allowed opacity-60 hover:ring-0 hover:ring-offset-0",
          className
        )}
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
        aria-disabled={isDisabled}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {showIcon && iconPosition === "left" && <IconComponent />}
          {children}
          {showIcon && iconPosition === "right" && <IconComponent />}
        </span>

        {/* Shine effect animation */}
        <div 
          className={cn(
            "ease-[cubic-bezier(0.19,1,0.22,1)] absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]",
            isDisabled && "hidden"
          )}
        />
      </Link>
    )
  }
)

ShinyButton.displayName = "ShinyButton"