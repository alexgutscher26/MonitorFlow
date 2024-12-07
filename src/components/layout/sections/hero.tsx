"use client"

import { DiscordMessage } from "@/components/discord-message"
import { MockDiscordUI } from "@/components/mock-discord-ui"
import { ShinyButton } from "@/components/shiny-button"
import { AnimatedList } from "@/components/ui/animated-list"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"

const features = [
  "Real-time Discord alerts for critical events",
  "Instant notifications for any event",
  "Track sales, new users, or any other event",
]

export const HeroSection = () => {
  const { theme } = useTheme()

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50 dark:bg-transparent overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Real-Time SaaS Insights,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Delivered to Your Discord
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            MonitorFlow is the easiest way to monitor your SaaS. Get instant notifications for sales, new users, or any other event sent directly to your Discord.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <ul className="space-y-3 text-left">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <ShinyButton
              href="/sign-up"
              className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              Start For Free Today
            </ShinyButton>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-800/30 dark:ring-gray-700">
            <MockDiscordUI>
              <AnimatedList>
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="PingPanda Avatar"
                  username="PingPanda"
                  timestamp="Today at 12:35PM"
                  badgeText="SignUp"
                  badgeColor="#43b581"
                  title="👤 New user signed up"
                  content={{
                    name: "Mateo Ortiz",
                    email: "m.ortiz19@gmail.com",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="PingPanda Avatar"
                  username="PingPanda"
                  timestamp="Today at 12:35PM"
                  badgeText="Revenue"
                  badgeColor="#faa61a"
                  title="💰 Payment received"
                  content={{
                    amount: "$49.00",
                    email: "zoe.martinez2001@email.com",
                    plan: "PRO",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="PingPanda Avatar"
                  username="PingPanda"
                  timestamp="Today at 5:11AM"
                  badgeText="Milestone"
                  badgeColor="#5865f2"
                  title="🚀 Revenue Milestone Achieved"
                  content={{
                    recurringRevenue: "$5.000 USD",
                    growth: "+8.2%",
                  }}
                />
              </AnimatedList>
            </MockDiscordUI>
          </div>
        </div>
      </div>
    </section>
  )
}
