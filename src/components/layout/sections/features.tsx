"use client";

import { Check, Gauge, Bell, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Advanced Monitoring",
    description: "Monitor your services with detailed metrics and insights",
    icon: Gauge,
    items: [
      "Real-time performance tracking",
      "Custom alert thresholds",
      "Historical data analysis",
      "Service dependency mapping",
    ],
  },
  {
    title: "Smart Notifications",
    description: "Get notified about what matters most to your team",
    icon: Bell,
    items: [
      "Customizable alert rules",
      "Multi-channel notifications",
      "Alert grouping and routing",
      "Incident escalation paths",
    ],
  },
  {
    title: "Team Collaboration",
    description: "Work together effectively during incidents",
    icon: Users,
    items: [
      "Shared incident views",
      "Team chat integration",
      "Role-based access control",
      "Audit logs and reporting",
    ],
  },
];

export function FeaturesSection() {
  return (
    <section className="flex w-full flex-col items-center space-y-12 bg-slate-50/50 py-16 dark:bg-transparent md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-[58rem] flex-col items-center space-y-4 text-center"
      >
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Powerful Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to monitor and maintain your services effectively
        </p>
      </motion.div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group relative overflow-hidden rounded-xl border bg-background p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex h-full flex-col rounded-lg p-6">
              <div className="mb-8 flex items-center space-x-4">
                <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
              <ul className="grid gap-3">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center text-sm">
                    <div className="mr-2 rounded-full bg-primary/10 p-1 group-hover:bg-primary/20">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
