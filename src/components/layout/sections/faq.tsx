"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is PingPanda?",
    answer: "PingPanda is a modern uptime monitoring service that helps you track the availability and performance of your websites, APIs, and servers. We provide real-time alerts, detailed analytics, and comprehensive monitoring from multiple locations worldwide.",
    value: "what-is",
  },
  {
    question: "How does the monitoring work?",
    answer: "Our service performs regular health checks on your endpoints from multiple global locations. We send requests to your specified URLs and monitor response times, status codes, and content. If any issues are detected, we immediately notify you through your chosen notification channels (email, Slack, Discord, etc.).",
    value: "how-works",
  },
  {
    question: "What's included in the free plan?",
    answer: "The free plan includes up to 3 monitors with 5-minute check intervals, basic uptime reporting, and email notifications. It's perfect for individuals and small projects getting started with uptime monitoring.",
    value: "free-plan",
  },
  {
    question: "Can I monitor internal services or localhost?",
    answer: "Yes! With our agent-based monitoring, you can monitor internal services, databases, and localhost applications. The agent runs securely within your infrastructure and reports back to our platform while keeping your internal services private.",
    value: "internal-monitoring",
  },
  {
    question: "Do you support custom alert integrations?",
    answer: "Absolutely! We support a wide range of notification channels including email, SMS, Slack, Discord, Microsoft Teams, and webhooks. Pro and Enterprise plans can also set up custom alert workflows with different notification rules for different team members.",
    value: "integrations",
  },
  {
    question: "What's your uptime guarantee?",
    answer: "We maintain a 99.9% uptime SLA for our monitoring infrastructure. Enterprise customers receive additional guarantees and priority support. Our monitoring nodes are distributed across multiple regions to ensure reliable monitoring even if some nodes experience issues.",
    value: "uptime-sla",
  },
];

export const FAQSection = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-white/25 [mask-image:radial-gradient(white,transparent_95%)]" />
      
      <div className="container relative max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about PingPanda's uptime monitoring service
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQList.map(({ question, answer, value }, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <AccordionItem
                  value={value}
                  className="border rounded-lg px-4 bg-card shadow-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-medium">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
