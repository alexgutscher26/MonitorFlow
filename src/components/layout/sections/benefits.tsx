"use client";

import { Activity, AlertTriangle, Bell, Monitor, Settings, BarChart, Clock, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Real-time Monitoring",
    description: "Monitor your services 24/7 with instant alerts and comprehensive dashboards",
    icon: Monitor,
  },
  {
    title: "Incident Management",
    description: "Track and manage incidents with automated workflows and detailed timelines",
    icon: AlertTriangle,
  },
  {
    title: "Performance Analytics",
    description: "Gain insights with detailed metrics, trends, and performance analysis",
    icon: BarChart,
  },
  {
    title: "Smart Notifications",
    description: "Receive context-aware alerts through multiple channels with intelligent filtering",
    icon: Bell,
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with shared dashboards and incident responses",
    icon: Users,
  },
  {
    title: "Uptime Guarantee",
    description: "Track and maintain high availability with historical uptime metrics",
    icon: Clock,
  },
  {
    title: "Security First",
    description: "Enterprise-grade security with encrypted data and access controls",
    icon: Shield,
  },
  {
    title: "Easy Configuration",
    description: "Get started in minutes with intuitive setup and flexible customization",
    icon: Settings,
  },
];

export function BenefitsSection() {
  return (
    <section className="flex w-full flex-col items-center space-y-8 bg-slate-50 py-12 dark:bg-transparent md:py-16 lg:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-[58rem] flex-col items-center space-y-4 text-center"
      >
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Why Choose PingPanda?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Experience enterprise-grade monitoring with features trusted by developers worldwide
        </p>
      </motion.div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 
            }}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            className="relative overflow-hidden rounded-lg border bg-background p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex h-[200px] flex-col items-center justify-between rounded-md p-6 text-center">
              <benefit.icon className="h-12 w-12 transition-transform duration-200 ease-in-out group-hover:scale-110" />
              <div className="space-y-2">
                <h3 className="font-bold text-xl">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
