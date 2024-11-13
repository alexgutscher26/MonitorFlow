import { DashboardPage } from "@/components/dashboard-page"
import { AnalyticsPageContent } from "./analytics-page-content"

const AnalyticsPage = () => {
  return (
    <DashboardPage title="Analytics Overview">
      <AnalyticsPageContent />
    </DashboardPage>
  )
}

export default AnalyticsPage