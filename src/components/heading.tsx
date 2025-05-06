import { cn } from "@/utils"
import { HTMLAttributes, ReactNode } from "react"

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string
  description: string
}

export const Heading = ({ title, description, className, ...props }: HeadingProps) => {
  return (
    <div>
      <h1
        className={cn(
          "text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-zinc-800",
          className
        )}
        {...props}
      >
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
