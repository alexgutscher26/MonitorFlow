"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

import { cn } from "@/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function Navbar() {
  const pathname = usePathname()
  const isOnDashboard = pathname?.startsWith("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">PingPanda</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {!isOnDashboard && (
              <>
                <Link
                  href="/features"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/features"
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/pricing"
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/docs"
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  Docs
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            {isOnDashboard ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href={isOnDashboard ? "/dashboard" : "/sign-in"}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                {isOnDashboard ? "Dashboard" : "Sign In"}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
