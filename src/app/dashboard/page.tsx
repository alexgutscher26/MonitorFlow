import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./dashboard-page-content";
import { CreateEventCategoryModal } from "@/components/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * Page Component
 *
 * This is the main dashboard page for authenticated users. Depending on query parameters,
 * it handles payment intent, success messages, and displays the dashboard content.
 *
 * - Redirects to sign-in if the user is not authenticated.
 * - If the user is authenticated but not in the database, redirects to the welcome page.
 * - Triggers a checkout session if `intent` is "upgrade".
 *
 * @param {PageProps} props - The page props including searchParams for handling specific actions.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const Page = async ({ searchParams }: PageProps) => {
  // Get the current authenticated user
  const auth = await currentUser();

  // Redirect unauthenticated users to the sign-in page
  if (!auth) {
    redirect("/sign-in");
  }

  // Retrieve the user from the database by external ID
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  // Redirect users who are not found in the database to the welcome page
  if (!user) {
    return redirect("/welcome");
  }

  // Handle upgrade intent if present in search params
  const intent = searchParams.intent;
  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    });

    if (session.url) {
      redirect(session.url);
    }
  }

  // Show success modal if payment was successful
  const success = searchParams.success === "true";

  return (
    <>
      {success && <PaymentSuccessModal />}

      <DashboardPage
        title="Dashboard"
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
};

export default Page;
