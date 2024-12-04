import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { CreateSLADialog } from "@/components/sla/CreateSLADialog";
import { DeleteSLADialog } from "@/components/sla/DeleteSLADialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SLAStatusIndicator } from "@/components/sla/SLAStatusIndicator";
import { SLATrendGraph } from "@/components/sla/SLATrendGraph";
import { ExportSLAButton } from "@/components/sla/ExportSLAButton";
import { ImportSLAButton } from "@/components/sla/ImportSLAButton";
import { SLAThresholdConfig } from "@/components/sla/SLAThresholdConfig";
import { NotificationHistory } from "@/components/sla/NotificationHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

async function getSLAData() {
  try {
    const auth = await currentUser();
    if (!auth) return null;

    const user = await db.user.findUnique({
      where: { externalId: auth.id },
    });

    if (!user) {
      return redirect("/welcome");
    }

    const slas = await db.sLADefinition.findMany({
      where: {
        userId: user.id,
      },
      include: {
        measurements: {
          orderBy: {
            endTime: "desc",
          },
          take: 30, // Get last 30 measurements for trend graph
        },
        EventCategory: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const categories = await db.eventCategory.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return { slas, categories, user };
  } catch (error) {
    console.error("Error fetching SLA data:", error);
    throw error;
  }
}

function SLASkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="space-y-2">
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-3 w-3/4 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2 w-full bg-muted rounded"></div>
            <div className="flex justify-between">
              <div className="h-3 w-1/4 bg-muted rounded"></div>
              <div className="h-3 w-1/4 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function SLAPage() {
  const data = await getSLAData();
  if (!data) return null;

  const { slas, categories, user } = data;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SLA Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your Service Level Agreements
          </p>
        </div>
        <CreateSLADialog 
          categories={categories} 
          user={{ plan: user.plan }}
          currentSLACount={slas.length}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="border-b">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="text-lg px-6">
              <div className="flex items-center gap-2">
                📊 Overview
              </div>
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-lg px-6">
              <div className="flex items-center gap-2">
                📈 Trend Analysis
              </div>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-lg px-6">
              <div className="flex items-center gap-2">
                📣 Notifications
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">SLA Status Overview</h2>
              <p className="text-sm text-muted-foreground">
                Current status and performance of your service level agreements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ImportSLAButton />
              <ExportSLAButton slas={slas} />
            </div>
          </div>
          
          <Suspense fallback={<SLASkeleton />}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {slas.map((sla) => (
                <Card key={sla.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          {sla.EventCategory?.emoji || "🎯"} {sla.name}
                        </CardTitle>
                        <CardDescription>{sla.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        {sla.measurements.length > 0 && (
                          <SLAStatusIndicator
                            currentUptime={sla.measurements[0].uptimePercent}
                            target={sla.target}
                          />
                        )}
                        <DeleteSLADialog slaId={sla.id} slaName={sla.name} />
                        <SLAThresholdConfig
                          slaId={sla.id}
                          target={sla.target}
                          initialThresholds={{
                            warningThreshold: sla.warningThreshold ?? sla.target - 2,
                            criticalThreshold: sla.criticalThreshold ?? sla.target - 5,
                            enableNotifications: sla.enableNotifications,
                            emailNotifications: sla.emailNotifications,
                            webhookNotifications: sla.webhookNotifications,
                            webhookUrl: sla.webhookUrl ?? undefined,
                          }}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Uptime</span>
                          <span className="font-medium">
                            {sla.measurements.length > 0
                              ? `${sla.measurements[0].uptimePercent.toFixed(2)}%`
                              : "No data"}
                          </span>
                        </div>
                        <Progress
                          value={sla.measurements.length > 0 ? sla.measurements[0].uptimePercent : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>Target: {sla.target}%</div>
                        <div>Window: {sla.timeWindow}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {slas.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No SLAs defined yet. Create your first SLA to start tracking uptime.
                </div>
              )}
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Performance Trends</h2>
              <p className="text-sm text-muted-foreground">
                Historical performance analysis and trend visualization
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {slas.filter(sla => sla.measurements.length > 0).map((sla) => (
              <SLATrendGraph
                key={`trend-${sla.id}`}
                measurements={sla.measurements}
                target={sla.target}
                title={`${sla.EventCategory?.emoji || "🎯"} ${sla.name} - Performance Trend`}
              />
            ))}
            {slas.filter(sla => sla.measurements.length > 0).length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <div className="h-6 w-6 text-2xl">📊</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    No SLA measurement data available yet. Data will appear here once your SLAs start collecting measurements.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-4">
            {slas.map((sla) => (
              <NotificationHistory key={sla.id} slaId={sla.id} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
