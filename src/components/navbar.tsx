import Link from "next/link";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { SignOutButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Navbar Component
 *
 * Displays a navigation bar with dynamic links based on user authentication status:
 * - Shows "Sign in", "Sign up", and "Pricing" if the user is not signed in.
 * - Shows "Dashboard" and "Sign out" if the user is signed in.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="sticky z-[100] inset-x-0 top-0 w-full h-16 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex font-semibold z-40">
            Monitor<span className="text-brand-700">Flow</span>
          </Link>

          {/* Dynamic navigation links based on user status */}
          <div className="flex h-full items-center space-x-4">
            {user ? (
              // Links displayed if the user is signed in
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>

                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1",
                  })}
                >
                  Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            ) : (
              // Links displayed if the user is not signed in
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200" />

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5",
                  })}
                >
                  Sign up <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
