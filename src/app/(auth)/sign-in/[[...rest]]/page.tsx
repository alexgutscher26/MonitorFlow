"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

/**
 * Page Component
 * 
 * A client-side component rendering a sign-in page.
 * This component handles optional intent redirection based on URL search parameters.
 *
 * @returns {JSX.Element} The rendered sign-in page component.
 */
const Page = () => {
  // Get search parameters from the URL
  const searchParams = useSearchParams();

  /**
   * Extracts the "intent" parameter from the URL.
   * If "intent" is not present, it defaults to `null`.
   */
  const intent = searchParams.get("intent");

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn
        /**
         * Redirects to the dashboard after sign-in. 
         * If an "intent" parameter is present, it appends the intent query.
         */
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      />
    </div>
  );
};

export default Page;
