import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UpgradePageContent } from "./upgrade-page-content";

/**
 * Page Component
 *
 * Renders the Pro Membership upgrade page. It verifies user authentication,
 * retrieves the user's current plan, and redirects to the sign-in page if unauthenticated.
 *
 * @returns {JSX.Element} The DashboardPage component with upgrade content.
 */
const Page = async () => {
  const auth = await currentUser();

  // Redirect to sign-in if user is not authenticated
  if (!auth) {
    redirect("/sign-in");
  }

  // Retrieve user data based on Clerk's external ID
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  // Redirect to sign-in if user record is not found
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <DashboardPage title="Pro Membership">
      <UpgradePageContent plan={user.plan} />
    </DashboardPage>
  );
};

export default Page;
