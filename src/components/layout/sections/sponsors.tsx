"use client"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import {
  Boxes,
  Train,
  Database,
  Layers,
  Lock,
  Cloud,
  Server,
  Globe,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SponsorProps {
  icon: React.ElementType
  name: string
}

const sponsors: SponsorProps[] = [
  { icon: Boxes, name: "Vercel" },
  { icon: Train, name: "Railway" },
  { icon: Database, name: "PlanetScale" },
  { icon: Layers, name: "Supabase" },
  { icon: Lock, name: "Clerk" },
  { icon: Cloud, name: "AWS" },
  { icon: Server, name: "Azure" },
  { icon: Globe, name: "Cloudflare" },
]

export function SponsorsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const scrollWidth = scroller.scrollWidth
    const clientWidth = scroller.clientWidth

    let scrollPos = 0
    let direction = 1
    let animationFrameId: number

    const scroll = () => {
      if (!scroller) return

      scrollPos += 0.5 * direction

      // Reset position for seamless loop
      if (scrollPos >= scrollWidth - clientWidth) {
        scrollPos = 0
      }

      scroller.scrollLeft = scrollPos
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId)
    }

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll)
    }

    scroller.addEventListener("mouseenter", handleMouseEnter)
    scroller.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (scroller) {
        scroller.removeEventListener("mouseenter", handleMouseEnter)
        scroller.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Spotlight Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent blur-3xl" />

      <MaxWidthWrapper className="relative">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Trusted by Industry Leaders
            </p>
          </div>

          <div
            ref={scrollerRef}
            className={cn(
              "relative flex w-full gap-6 overflow-hidden",
              "before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px]",
              "before:bg-gradient-to-r before:from-background before:to-transparent",
              "after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px]",
              "after:bg-gradient-to-l after:from-background after:to-transparent"
            )}
          >
            <div className="flex animate-scroll gap-6">
              {[...sponsors, ...sponsors].map((sponsor, idx) => {
                const IconComponent = sponsor.icon
                return (
                  <div
                    key={`${sponsor.name}-${idx}`}
                    className={cn(
                      "group relative flex min-w-[160px] flex-col items-center gap-4 rounded-lg px-6 py-8",
                      "transition duration-300 hover:scale-105"
                    )}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-transparent to-background/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <IconComponent
                      className="h-8 w-8 text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {sponsor.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
