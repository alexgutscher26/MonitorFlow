import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/utils"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/layout/theme-provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MonitorFlow - Real-Time SaaS Monitoring",
  description:
    "Get instant Discord notifications for your SaaS metrics. Track sales, users, and events in real-time with MonitorFlow.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
