"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Breadcrumb } from "./ui/breadcrumb";
import { IntegrationConfigModal } from "./integration-config-modal";
import Image from "next/image";
import { Search, X, ArrowUpRight } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: "available" | "coming_soon";
}

const SAMPLE_INTEGRATIONS: Integration[] = [
  // Automation Tools
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect PingPanda with 3000+ apps and automate your workflows",
    category: "Automation",
    icon: "/integrations/zapier.svg",
    status: "coming_soon",
  },
  {
    id: "make",
    name: "Make.com",
    description: "Create complex automation workflows with visual builder",
    category: "Automation",
    icon: "/integrations/make.svg",
    status: "coming_soon",
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Open-source workflow automation tool for technical users",
    category: "Automation",
    icon: "/integrations/n8n.svg",
    status: "coming_soon",
  },

  // Notification Systems
  {
    id: "slack",
    name: "Slack",
    description: "Get instant notifications and alerts in your Slack channels",
    category: "Notifications",
    icon: "/integrations/slack.svg",
    status: "coming_soon",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Route alerts to Discord channels with rich formatting",
    category: "Notifications",
    icon: "/integrations/discord.svg",
    status: "coming_soon",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Send alerts and updates to Microsoft Teams channels",
    category: "Notifications",
    icon: "/integrations/teams.svg",
    status: "coming_soon",
  },

  // Monitoring Tools
  {
    id: "datadog",
    name: "Datadog",
    description: "Correlate PingPanda events with your Datadog metrics",
    category: "Monitoring",
    icon: "/integrations/datadog.svg",
    status: "coming_soon",
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Visualize PingPanda metrics in your Grafana dashboards",
    category: "Monitoring",
    icon: "/integrations/grafana.svg",
    status: "coming_soon",
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Export metrics to Prometheus for advanced monitoring",
    category: "Monitoring",
    icon: "/integrations/prometheus.svg",
    status: "coming_soon",
  },

  // Alerting Systems
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Route critical alerts to your on-call teams",
    category: "Alerting",
    icon: "/integrations/pagerduty.svg",
    status: "coming_soon",
  },
  {
    id: "opsgenie",
    name: "Opsgenie",
    description: "Manage alerts and on-call schedules with Opsgenie",
    category: "Alerting",
    icon: "/integrations/opsgenie.svg",
    status: "coming_soon",
  },
  {
    id: "victorops",
    name: "VictorOps",
    description: "Incident management and alert routing with VictorOps",
    category: "Alerting",
    icon: "/integrations/victorops.svg",
    status: "coming_soon",
  },

  // Development Tools
  {
    id: "github",
    name: "GitHub",
    description: "Create issues and update status checks automatically",
    category: "Development",
    icon: "/integrations/github.svg",
    status: "coming_soon",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Integrate with GitLab issues and CI/CD pipelines",
    category: "Development",
    icon: "/integrations/gitlab.svg",
    status: "coming_soon",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Create and update Jira issues based on alerts",
    category: "Development",
    icon: "/integrations/jira.svg",
    status: "coming_soon",
  },

  // Analytics
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track uptime impact on user behavior and conversions",
    category: "Analytics",
    icon: "/integrations/google-analytics.svg",
    status: "coming_soon",
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Analyze how outages affect user engagement",
    category: "Analytics",
    icon: "/integrations/mixpanel.svg",
    status: "coming_soon",
  }
];

const BREADCRUMB_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/integrations", label: "Integrations" },
];

const CATEGORIES = ["All", "Automation", "Notifications", "Monitoring", "Alerting", "Development", "Analytics"];

export function IntegrationMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState<number>(-1);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard navigation
  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : CATEGORIES.length - 1;
        categoryRefs.current[prevIndex]?.focus();
        setFocusedCategoryIndex(prevIndex);
        break;
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = index < CATEGORIES.length - 1 ? index + 1 : 0;
        categoryRefs.current[nextIndex]?.focus();
        setFocusedCategoryIndex(nextIndex);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        setSelectedCategory(CATEGORIES[index]);
        break;
    }
  };

  // Reset refs array when categories change
  useEffect(() => {
    categoryRefs.current = categoryRefs.current.slice(0, CATEGORIES.length);
  }, []);

  // Add keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && e.target === document.body) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  // Filter integrations based on search query and selected category
  const filteredIntegrations = SAMPLE_INTEGRATIONS.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || integration.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get integration counts per category
  const categoryCount = CATEGORIES.reduce((acc, category) => {
    acc[category] = category === "All" 
      ? SAMPLE_INTEGRATIONS.length
      : SAMPLE_INTEGRATIONS.filter(i => i.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Highlight search matches in text
  const highlightMatches = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-yellow-100 text-yellow-900">{part}</span> : 
        part
    );
  };

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConfigModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={BREADCRUMB_ITEMS} className="mb-2" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Integration Marketplace</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Extend PingPanda's capabilities with our growing list of integrations
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search integrations... (Press '/' to focus)"
            className="w-full pl-9 pr-10 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div 
          className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0"
          role="tablist"
          aria-label="Integration categories"
        >
          {CATEGORIES.map((category, index) => (
            <Badge
              key={category}
              ref={(el: HTMLDivElement | null) => categoryRefs.current[index] = el}
              variant={category === selectedCategory ? "secondary" : "outline"}
              className="cursor-pointer whitespace-nowrap focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 group"
              onClick={() => setSelectedCategory(category)}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleCategoryKeyDown(e, index)}
              tabIndex={0}
              role="tab"
              aria-selected={category === selectedCategory}
              aria-controls={`category-${category.toLowerCase()}`}
            >
              {category}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                {categoryCount[category]}
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Integration grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="tabpanel"
        id={`category-${selectedCategory.toLowerCase()}`}
        aria-label={`${selectedCategory} integrations`}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredIntegrations.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-zinc-500">No integrations found matching your criteria.</p>
            </motion.div>
          ) : (
            filteredIntegrations.map((integration) => (
              <motion.div
                key={integration.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="flex flex-col bg-white border border-zinc-200 cursor-pointer hover:border-brand-500 transition-colors focus-within:ring-2 focus-within:ring-brand-500 group h-full"
                  onClick={() => handleIntegrationClick(integration)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Configure ${integration.name} integration`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleIntegrationClick(integration);
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg bg-zinc-50 p-2 border border-zinc-100 group-hover:border-brand-200 transition-colors">
                        <Image
                          src={integration.icon}
                          alt={`${integration.name} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2 text-zinc-900 group-hover:text-brand-600 transition-colors">
                          {highlightMatches(integration.name)}
                          {integration.status === "coming_soon" && (
                            <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-zinc-500">{integration.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600">
                      {highlightMatches(integration.description)}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4 border-t border-zinc-100">
                    <Button
                      className="w-full group/button"
                      variant={integration.status === "available" ? "default" : "secondary"}
                      disabled={integration.status === "coming_soon"}
                      onClick={(e: { stopPropagation: () => void; }) => {
                        e.stopPropagation();
                        handleIntegrationClick(integration);
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        {integration.status === "available" ? "Configure" : "Coming Soon"}
                        {integration.status === "available" && (
                          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/button:opacity-100 group-hover/button:translate-x-0 transition-all" />
                        )}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <IntegrationConfigModal
        integration={selectedIntegration}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedIntegration(null);
        }}
      />
    </div>
  );
} 