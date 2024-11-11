"use client";

import { Heading } from "@/components/heading";
import { LoadingSpinner } from "@/components/loading-spinner";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { LucideProps } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Page Component
 *
 * Renders a loading page that checks and waits for user account synchronization.
 * Once synchronization is complete, it redirects the user to the dashboard.
 *
 * @returns {JSX.Element} The rendered loading and synchronization status page.
 */
const Page = () => {
  const router = useRouter();

  // Fetches the database sync status at regular intervals
  const { data } = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: async () => {
      const res = await client.auth.getDatabaseSyncStatus.$get();
      return await res.json();
    },
    // Refetch every second if sync isn't complete; stops when synced
    refetchInterval: (query) => query.state.data?.isSynced ? false : 1000,
  });

  // Redirect to the dashboard once data synchronization is complete
  useEffect(() => {
    if (data?.isSynced) router.push("/dashboard");
  }, [data, router]);

  return (
    <div className="flex w-full flex-1 items-center justify-center px-4">
      <BackgroundPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />

      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-6 text-center">
        <LoadingSpinner size="md" />
        <Heading>Creating your account...</Heading>
        <p className="text-base/7 text-gray-600 max-w-prose">
          Just a moment while we set things up for you.
        </p>
      </div>
    </div>
  );
};

/**
 * BackgroundPattern Component
 *
 * Renders a background pattern SVG to enhance the visual appearance of the page.
 *
 * @param {LucideProps} props - Properties for customizing the SVG, such as `className`.
 * @returns {JSX.Element} The background SVG element.
 */
const BackgroundPattern = (props: LucideProps) => {
  return (
    <svg
      width="768"
      height="736"
      viewBox="0 0 768 736"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <mask
        id="mask0_5036_374506"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="-32"
        width="768"
        height="768"
      >
        <rect
          width="768"
          height="768"
          transform="translate(0 -32)"
          fill="url(#paint0_radial_5036_374506)"
        />
      </mask>
      <g mask="url(#mask0_5036_374506)">
        {/* Render vertical grid lines */}
        {[...Array(16)].map((_, index) => (
          <line
            key={`vertical-line-${index}`}
            x1={`${index * 48 + 0.5}`}
            y1="-32"
            x2={`${index * 48 + 0.5}`}
            y2="736"
            stroke="#E4E7EC"
          />
        ))}
        <rect x="0.5" y="-31.5" width="767" height="767" stroke="#E4E7EC" />
        {/* Render horizontal grid lines */}
        {[...Array(16)].map((_, index) => (
          <line
            key={`horizontal-line-${index}`}
            y1={`${index * 48 + 15.5}`}
            x2="768"
            y2={`${index * 48 + 15.5}`}
            stroke="#E4E7EC"
          />
        ))}
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_5036_374506"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(384 384) rotate(90) scale(384 384)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Page;
