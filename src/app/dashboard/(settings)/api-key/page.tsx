import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApiKeySettings } from "./api-key-settings";

const Page = async () => {
  const auth = await currentUser();
  
  const user = auth && await db.user.findUnique({
    where: { externalId: auth.id },
  });

  // Redirect if user is not authenticated or user data is missing
  if (!auth || !user) {
    return redirect("/sign-in");
  }

  return (
    <DashboardPage title="API Key">
      <ApiKeySettings apiKey={user.apiKey ?? ""} />
    </DashboardPage>
  );
}

export default Page;
