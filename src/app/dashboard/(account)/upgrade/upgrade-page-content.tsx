"use client";

import { Card } from "@/components/ui/card";
import { client } from "@/lib/client";
import { Plan } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BarChart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Component displaying the content of the Upgrade Page.
 * Shows usage statistics and allows users to upgrade their plan.
 *
 * @param {Object} props - Component properties.
 * @param {Plan} props.plan - The current plan of the user (e.g., 'FREE' or 'PRO').
 * @returns {JSX.Element} JSX element for the UpgradePageContent.
 */
export const UpgradePageContent = ({ plan }: { plan: Plan }): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mutation to create a checkout session for upgrading the plan.
   * On success, redirects the user to the checkout URL.
   */
  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const res = await client.payment.createCheckoutSession.$post();
        return await res.json();
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url);
    },
  });

  /**
   * Query to retrieve usage data, including events used and categories used.
   */
  const { data: usageData, isLoading: usageLoading, isError } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await client.project.getUsage.$get();
      return await res.json();
    },
  });

  const isProPlan = plan === "PRO";
  const planDescription = isProPlan
    ? "Thank you for supporting MonitorFlow. Find your increased usage limits below."
    : "Get access to more events, categories, and premium support.";

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
          Plan: {isProPlan ? "Pro" : "Free"}
        </h1>
        <p className="text-sm/6 text-gray-600 max-w-prose">{planDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-brand-700">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {usageData?.eventsUsed || 0} of{" "}
              {usageData?.eventsLimit?.toLocaleString() || "100"}
            </p>
            <p className="text-xs/5 text-muted-foreground">Events this period</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm/6 font-medium">Event Categories</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {usageData?.categoriesUsed || 0} of{" "}
              {usageData?.categoriesLimit?.toLocaleString() || "10"}
            </p>
            <p className="text-xs/5 text-muted-foreground">Active categories</p>
          </div>
        </Card>
      </div>

      <p className="text-sm text-gray-500">
        Usage will reset{" "}
        {usageLoading ? (
          <span className="animate-pulse w-8 h-4 bg-gray-200 inline-block" />
        ) : (
          format(new Date(usageData?.resetDate || Date.now()), "MMM d, yyyy")
        )}
        {!isProPlan && (
          <button
            onClick={() => createCheckoutSession()}
            className="inline cursor-pointer underline text-brand-600 ml-1"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Processing..." : "Upgrade now to increase your limit →"}
          </button>
        )}
      </p>

      {isError && (
        <p className="text-sm text-red-600" aria-live="polite">
          Failed to load usage data. Please try again later.
        </p>
      )}
    </div>
  );
};
