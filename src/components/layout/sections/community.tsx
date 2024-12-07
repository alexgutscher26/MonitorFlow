"use client";

import { motion } from "framer-motion";

const communityStats = [
  { number: "10K+", label: "Active Users" },
  { number: "500+", label: "Discord Members" },
  { number: "100+", label: "GitHub Stars" },
  { number: "50+", label: "Contributors" },
];

const communityFeatures = [
  {
    icon: "🤝",
    title: "Active Community",
    description: "Join discussions, share experiences, and learn from peers in our growing community of DevOps professionals.",
  },
  {
    icon: "📚",
    title: "Knowledge Base",
    description: "Access our comprehensive documentation, best practices, and implementation guides.",
  },
  {
    icon: "🎯",
    title: "Feature Requests",
    description: "Influence our roadmap by suggesting and voting on new features that matter to you.",
  },
  {
    icon: "🛠️",
    title: "Open Source",
    description: "Contribute to our open-source components and help shape the future of monitoring.",
  },
];

export const CommunitySection = () => {
  return (
    <section className="relative flex w-full flex-col items-center space-y-12 bg-slate-50/50 py-16 dark:bg-transparent md:py-24">
      <div className="absolute inset-0 bg-grid-white/25 [mask-image:radial-gradient(white,transparent_95%)]" />
      <div className="relative w-full flex flex-col items-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex max-w-[58rem] flex-col items-center space-y-4 text-center"
        >
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Community
          </span>
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Join Our Growing Community
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Connect with fellow developers and DevOps professionals
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center space-y-2 rounded-lg bg-background/60 p-4 text-center shadow-sm"
            >
              <span className="text-3xl font-bold text-primary">{stat.number}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative w-full max-w-7xl"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative grid w-full gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
            {communityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group rounded-lg border bg-background/60 p-6 shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="mb-3 text-2xl">{feature.icon}</div>
                <h3 className="mb-2 font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
