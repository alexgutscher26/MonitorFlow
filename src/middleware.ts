import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { redis } from "@/lib/redis"

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.ip ?? "127.0.0.1"
    const key = `ratelimit_${ip}`
    
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, 60) // Reset after 60 seconds
    }

    if (current > 10) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      })
    }
  }

  // Apply Clerk authentication middleware
  return clerkMiddleware()(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/dashboard(.*)",
    "/welcome",
  ],
}
