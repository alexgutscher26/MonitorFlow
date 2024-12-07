"use client"

import { buttonVariants } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/utils"
import { UserButton } from "@clerk/nextjs"
import {
  Activity,
  Gem,
  Home,
  Key,
  LucideIcon,
  Menu,
  Settings,
  X,
} from "lucide-react"
import Link from "next/link"
import { PropsWithChildren, useState } from "react"
import { Drawer } from "vaul"

interface SidebarItem {
  href: string
  icon: LucideIcon
  text: string
  description?: string
}

interface SidebarCategory {
  category: string
  items: SidebarItem[]
}

const SIDEBAR_ITEMS: SidebarCategory[] = [
  {
    category: "Overview",
    items: [
      { href: "/dashboard", icon: Home, text: "Dashboard" },
      { href: "/dashboard/sla", icon: Activity, text: "SLA Tracking" },
    ],
  },
  {
    category: "Account",
    items: [{ href: "/dashboard/upgrade", icon: Gem, text: "Upgrade" }],
  },
  {
    category: "Settings",
    items: [
      { href: "/dashboard/api-keys", icon: Key, text: "API Keys" },
      {
        href: "/dashboard/account-settings",
        icon: Settings,
        text: "Account Settings",
      },
    ],
  },
]

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="size-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
      <span className="text-white text-lg">🐼</span>
    </div>
    <p className="text-lg/7 font-semibold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
      Monitor<span className="text-brand-600">Flow</span>
    </p>
  </div>
)

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  return (
    <nav className="space-y-6 md:space-y-8 relative z-20 flex flex-col h-full" role="navigation" aria-label="Main navigation">
      {/* logo */}
      <div className="hidden sm:block">
        <Logo />
      </div>

      {/* navigation items */}
      <div className="flex-grow">
        <ul role="list" className="space-y-6">
          {SIDEBAR_ITEMS.map(({ category, items }) => (
            <li key={category} className="space-y-2">
              <p className="text-xs font-medium leading-6 text-gray-400 uppercase tracking-wider ml-4" role="heading" aria-level={2}>
                {category}
              </p>
              <div className="space-y-1">
                {items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start group flex items-center gap-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                      "active:scale-[0.98]"
                    )}
                    onClick={onClose}
                    aria-label={item.description || item.text}
                  >
                    <span className="flex items-center justify-center size-6 rounded-md bg-white shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 group-hover:shadow group-hover:ring-gray-900/10 group-hover:-rotate-6">
                      <item.icon className="size-4 text-gray-600 transition-colors group-hover:text-gray-900" aria-hidden="true" />
                    </span>
                    {item.text}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" role="separator" />

        <div className="relative rounded-lg bg-gray-50/50 p-4 ring-1 ring-gray-900/5">
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: "flex-row-reverse w-full gap-3",
                userButtonTrigger: "w-full hover:opacity-80 transition-opacity",
                userButtonOuterIdentifier: "font-medium text-gray-700",
              },
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </nav>
  )
}

const Layout = ({ children }: PropsWithChildren) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="relative h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
      {/* sidebar for desktop */}
      <aside className="hidden md:block w-72 xl:w-80 border-r border-gray-200/80 bg-white/80 backdrop-blur-xl p-6 h-full relative z-10">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
          <Logo />
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="size-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* main content area */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8 relative z-10">
          <div className="relative min-h-full flex flex-col max-w-7xl mx-auto">
            <div className="h-full flex flex-col flex-1 space-y-6">
              {children}
            </div>
          </div>
        </main>

        <Modal
          className="p-0 max-w-[90vw] md:max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/80"
          showModal={isDrawerOpen}
          setShowModal={setIsDrawerOpen}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
            <Logo />
            <button
              className="size-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4">
            <Sidebar onClose={() => setIsDrawerOpen(false)} />
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Layout
