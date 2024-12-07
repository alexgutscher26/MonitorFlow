// File: app/layout.tsx (or the appropriate location for RootLayout in your project)
import type { Metadata } from "next"
import { Inter, EB_Garamond } from "next/font/google"
import { Providers } from "@/components/providers"
import { cn } from "@/utils"
import { Toaster } from "sonner"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
})

// Metadata for the app
export const metadata: Metadata = {
  title: "MonitorFlow",
  description: "Monitor your services with ease",
}

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, ebGaramond.variable)}>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 text-brand-950 antialiased">
          <main className="relative flex-1 flex flex-col">
            <Providers>

                {children}

              <Toaster richColors />
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
