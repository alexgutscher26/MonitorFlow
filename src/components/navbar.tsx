"use client"

import { SignOutButton, useUser } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button, buttonVariants } from "./ui/button"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { cn } from "../lib/utils"

interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

const navItems: NavItem[] = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Documentation",
    href: "/docs",
  },
  {
    label: "Blog",
    href: "/blog",
  },
]

export const Navbar = () => {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav
      className={cn(
        "sticky inset-x-0 top-0 z-[100] h-16 w-full transition-all duration-300",
        {
          "border-b bg-background/80 backdrop-blur-lg": isScrolled || isMobileMenuOpen,
          "bg-background/0": !isScrolled && !isMobileMenuOpen,
        }
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold transition-colors">
            <span className="text-2xl">🐼</span>
            <span>
              Monitor<span className="text-brand-700">Flow</span>
            </span>
          </Link>

          {/* Center navigation items */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
                {...(item.isExternal && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 md:flex">
              {isSignedIn ? (
                <>
                  <SignOutButton>
                    <Button size="sm" variant="ghost">
                      Sign out
                    </Button>
                  </SignOutButton>

                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      className: "flex items-center gap-1.5",
                    })}
                  >
                    Dashboard <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      size: "sm",
                      className: "flex items-center gap-1.5",
                    })}
                  >
                    Get started <ArrowRight className="size-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
