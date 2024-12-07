"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  GithubIcon,
  TwitterIcon,
  MonitorIcon,
  ArrowUpRightIcon,
} from "lucide-react"
import DiscordIcon from "@/components/icons/discord-icon"
import Link from "next/link"
import { ShinyButton } from "@/components/shiny-button"

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Status", href: "/status" },
      { name: "API", href: "/api" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Blog", href: "/blog" },
      { name: "Community", href: "#community" },
      { name: "Support", href: "/support" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
      { name: "Security", href: "/security" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        name: "GitHub",
        href: "https://github.com/pingpanda",
        icon: GithubIcon,
      },
      {
        name: "Twitter",
        href: "https://twitter.com/pingpanda",
        icon: TwitterIcon,
      },
    ],
  },
]

export const FooterSection = () => {
  return (
    <footer className="relative w-full border-t bg-card/50">
      <div className="absolute inset-0 bg-grid-white/25 [mask-image:radial-gradient(white,transparent_95%)]" />

      <div className="container relative py-16">
        <div className="w-full max-w-4xl ml-auto mr-24 p-12 bg-card/50 border border-secondary rounded-2xl">
          <div className="flex flex-col gap-12">
            {/* Brand section */}
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center space-x-2">
                <MonitorIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">PingPanda</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                Modern uptime monitoring for your websites, APIs, and services.
                Keep your systems running smoothly with real-time alerts.
              </p>
              <div className="pt-2">
                <ShinyButton
                  href="/sign-up"
                  className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  Start For Free Today
                </ShinyButton>
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-3 gap-x-24 gap-y-8">
              {footerLinks.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className={`group inline-flex items-center space-x-2 text-sm hover:text-primary transition-colors ${
                            link.icon
                              ? "opacity-85 hover:opacity-100"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            link.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {link.icon && <link.icon className="h-4 w-4" />}
                          <span>{link.name}</span>
                          {link.href.startsWith("http") && (
                            <ArrowUpRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Separator className="bg-border/50" />

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <p> {new Date().getFullYear()} PingPanda. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground px-0"
                  asChild
                >
                  <Link href="/terms">Terms</Link>
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground px-0"
                  asChild
                >
                  <Link href="/privacy">Privacy</Link>
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground px-0"
                  asChild
                >
                  <Link href="/cookies">Cookies</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
