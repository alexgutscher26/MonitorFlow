import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AccountSettings } from "./setttings-page-content";


/**
 * Account Settings page component.
 * Fetches the current user and retrieves associated account information from the database.
 * If the user is not authenticated or does not exist in the database, they are redirected to the sign-in page.
 *
 * @returns {Promise<JSX.Element>} JSX element for the Account Settings dashboard page.
 */
const Page = async (): Promise<JSX.Element> => {
  // Retrieve the currently authenticated user.
  const auth = await currentUser();

  // Redirect unauthenticated users to the sign-in page.
  if (!auth) {
    redirect("/sign-in");
  }

  // Retrieve user details from the database based on the authenticated user's external ID.
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  // Redirect users without a corresponding database entry to the sign-in page.
  if (!user) {
    redirect("/sign-in");
  }

  // Render the DashboardPage with AccountSettings if the user exists.
  return (
    <DashboardPage title="Account Settings">
      <AccountSettings discordId={user.discordId ?? ""} />
    </DashboardPage>
  );
};

export default Page;
