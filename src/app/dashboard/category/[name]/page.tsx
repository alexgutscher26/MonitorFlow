import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CategoryPageContent } from "./category-page-content";

interface PageProps {
  params: {
    name: string | string[] | undefined;
  };
}

/**
 * Page Component
 *
 * Displays a specific category page within the dashboard. Checks for user authentication,
 * retrieves the category by name and user ID, and displays a notFound page if any data is missing.
 *
 * @param {PageProps} props - The props object containing route parameters.
 * @returns {JSX.Element | null} The rendered DashboardPage or a notFound response.
 */
const Page = async ({ params }: PageProps) => {
  if (typeof params.name !== "string") {
    return notFound();
  }

  const auth = await currentUser();

  // Check if the user is authenticated
  if (!auth) {
    return notFound();
  }

  // Retrieve the user from the database using the Clerk external ID
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return notFound();
  }

  // Find the category by name and user ID, including event count
  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name: params.name,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  const hasEvents = category._count.events > 0;

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent hasEvents={hasEvents} category={category} />
    </DashboardPage>
  );
};

export default Page;
