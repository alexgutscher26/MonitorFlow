import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/utils"

interface BreadcrumbItem {
  href: string
  label: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-zinc-400" />
          )}
          <Link
            href={item.href}
            className={cn(
              "text-zinc-500 hover:text-zinc-700 transition-colors",
              index === items.length - 1 && "text-zinc-900 font-medium"
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
} 