"use client";

import { SignUp } from "@clerk/nextjs";

/**
 * Page Component
 *
 * A client-side component rendering a sign-up page.
 * This component utilizes Clerk's SignUp component to manage user registration.
 *
 * @returns {JSX.Element} The rendered sign-up page component.
 */
const Page = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignUp 
        /**
         * Redirects the user to the "/welcome" page after successful sign-up.
         * Provides a fallback URL if primary redirection fails.
         */
        fallbackRedirectUrl="/welcome"
        forceRedirectUrl="/welcome" 
      />
    </div>
  );
};

export default Page;
