import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { CategoryPageContent } from "./category-page-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertThresholds } from "@/components/alert-thresholds"
import { IncidentActionsWrapper } from "./incident-actions-wrapper"

interface PageProps {
  params: {
    name: string | string[] | undefined
  }
}

const Page = async ({ params }: PageProps) => {
  if (typeof params.name !== "string") return notFound()

  const auth = await currentUser()

  if (!auth) {
    return notFound()
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) return notFound()

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
  })

  if (!category) return notFound()

  const hasEvents = category._count.events > 0

  return (
    <DashboardPage title={`${category.emoji} ${category.name}`}>
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-4 bg-transparent">
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-brand-50"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-brand-50"
          >
            Alert Thresholds
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="data-[state=active]:bg-brand-50"
          >
            Incident Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="p-4">
          <div className="space-y-4">
            <CategoryPageContent hasEvents={hasEvents} category={category} />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="p-4">
          <AlertThresholds categoryName={params.name} />
        </TabsContent>

        <TabsContent value="actions" className="p-4">
          <IncidentActionsWrapper categoryName={params.name} />
        </TabsContent>
      </Tabs>
    </DashboardPage>
  )
}

export default Page
