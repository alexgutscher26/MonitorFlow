"use client"

import { ReactNode } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "./heading"
import { useRouter } from "next/navigation"

/**
 * Props for the DashboardPage component
 */
interface DashboardPageProps {
  /** Title text displayed at the top of the page */
  title: string
  /** Content to be displayed within the page */
  children?: ReactNode
  /** Hides the back button if true */
  hideBackButton?: boolean
  /** Call-to-action (CTA) element, rendered next to the title */
  cta?: ReactNode
}

/**
 * DashboardPage component
 *
 * - Displays a title, optional back button, and optional CTA at the top.
 * - Renders any children passed in as the main content of the page.
 *
 * @param title - The page title displayed at the top.
 * @param children - Main content of the page.
 * @param cta - Optional CTA element to display next to the title.
 * @param hideBackButton - Boolean to hide/show the back button.
 * @returns A full-page section component for dashboard pages.
 */
export const DashboardPage = ({
  title,
  children,
  cta,
  hideBackButton,
}: DashboardPageProps) => {
  const router = useRouter()

  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-8">
            {/* Back button, hidden if `hideBackButton` is true */}
            {!hideBackButton && (
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-fit bg-white"
                variant="outline"
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}

            <Heading>{title}</Heading>
          </div>

          {/* Optional Call-to-Action (CTA) element */}
          {cta && <div className="w-full">{cta}</div>}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}
