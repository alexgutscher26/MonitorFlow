import { clerkMiddleware, type WithClerkState } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { db } from "@/db"

// Custom middleware to handle domain routing
async function customDomainMiddleware(req: NextRequest) {
  const { hostname } = new URL(req.url)
  
  // Skip for localhost or the main app domain
  if (hostname === 'localhost' || hostname.includes('pingpanda.io')) {
    return clerkMiddleware()(req, async (event) => {
      return null;
    })
  }
  
  // Check if this is a custom domain
  try {
    const user = await db.user.findFirst({
      where: { brandCustomDomain: hostname },
      select: { id: true }
    })
    
    if (user) {
      // This is a custom domain - set a header to identify the user
      // This header will be used by the BrandingProvider to apply the correct branding
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set('x-custom-domain-user-id', user.id)
      
      // Continue with the request
      const response = await clerkMiddleware()(req, async (event) => {
        return null;
      })
      
      // Clone the response and add the custom domain user ID header
      const responseHeaders = new Headers(response.headers)
      responseHeaders.set('x-custom-domain-user-id', user.id)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
        headers: responseHeaders
      })
    }
  } catch (error) {
    console.error('Error in custom domain middleware:', error)
  }
  
  // If no custom domain match or error, proceed with normal Clerk middleware
  return clerkMiddleware()(req, async (event) => {
    return null;
  })
}

export default customDomainMiddleware

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