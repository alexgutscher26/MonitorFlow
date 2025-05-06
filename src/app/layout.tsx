import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { EB_Garamond } from "next/font/google"
import { cn } from "@/utils"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import PrivacyConsentBanner from "@/components/privacy-consent-banner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "PingPanda - Modern Fullstack Event Monitoring SaaS",
  description: "Monitor your events and get notified when things go wrong.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
        <body className="min-h-screen flex flex-col font-sans bg-brand-50 text-brand-950 antialiased">
          <main className="flex-1 flex flex-col">
            <Providers>{children}</Providers>
          </main>
          <Toaster />
          <PrivacyConsentBanner />
        </body>
      </html>
    </ClerkProvider>
  )
}
