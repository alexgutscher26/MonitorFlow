"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface FeatureFlag {
  id: string
  key: string
  name: string
  description?: string
  type: string
  value: any
  environment: string
  expiresAt?: string
  isArchived: boolean
  auditLogs: Array<{
    id: string
    action: string
    changes: any
    performedBy: string
    createdAt: string
  }>
}

export default function FeatureFlagsPage() {
  const queryClient = useQueryClient()
  const [environment, setEnvironment] = useState("development")
  const [showArchived, setShowArchived] = useState(false)
  const [newFlag, setNewFlag] = useState({
    key: "",
    name: "",
    description: "",
    type: "boolean",
    value: null,
    environment: "development",
    expiresAt: "",
  })

  const { data: flags } = useQuery<FeatureFlag[]>({
    queryKey: ["featureFlags", environment, showArchived],
    queryFn: async () => {
      const response = await fetch(
        `/api/feature-flags?environment=${environment}&includeArchived=${showArchived}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch feature flags")
      }
      return response.json()
    },
  })

  const createFlag = useMutation({
    mutationFn: async (flag: typeof newFlag) => {
      const response = await fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flag),
      })
      if (!response.ok) {
        throw new Error("Failed to create feature flag")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featureFlags"] })
      setNewFlag({
        key: "",
        name: "",
        description: "",
        type: "boolean",
        value: null,
        environment: "development",
        expiresAt: "",
      })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async (flag: FeatureFlag) => {
      const response = await fetch(`/api/feature-flags`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: flag.id,
          value: flag.type === "boolean" ? !flag.value : flag.value,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to update feature flag")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featureFlags"] })
    },
  })

  const updateFlag = useMutation({
    mutationFn: async (updates: Partial<FeatureFlag> & { id: string }) => {
      const response = await fetch("/api/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update feature flag")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featureFlags"] })
    },
  })

  const archiveFlag = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/feature-flags?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to archive feature flag")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featureFlags"] })
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Feature Flags</h1>
        <div className="flex gap-4">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
          <Switch
            checked={showArchived}
            onCheckedChange={setShowArchived}
            id="archived"
          />
          <Label htmlFor="archived">Show Archived</Label>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Feature Flag</CardTitle>
          <CardDescription>
            Add a new feature flag to your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createFlag.mutate(newFlag)
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={newFlag.key}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, key: e.target.value })
                  }
                  placeholder="feature-key"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newFlag.name}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, name: e.target.value })
                  }
                  placeholder="Feature Name"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newFlag.description}
                onChange={(e) =>
                  setNewFlag({ ...newFlag, description: e.target.value })
                }
                placeholder="Feature description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newFlag.type}
                  onValueChange={(value) =>
                    setNewFlag({
                      ...newFlag,
                      type: value,
                      value: value === "boolean" ? null : {},
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="percentage">
                      Percentage Rollout
                    </SelectItem>
                    <SelectItem value="userlist">User List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newFlag.type === "percentage" && (
                <div>
                  <Label htmlFor="percentage">Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={newFlag.value?.percentage || ""}
                    onChange={(e) =>
                      setNewFlag({
                        ...newFlag,
                        value: { percentage: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              )}
              {newFlag.type === "userlist" && (
                <div>
                  <Label htmlFor="users">User IDs (comma-separated)</Label>
                  <Input
                    id="users"
                    value={newFlag.value?.users?.join(",") || ""}
                    onChange={(e) =>
                      setNewFlag({
                        ...newFlag,
                        value: {
                          users: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={newFlag.environment}
                  onValueChange={(value) =>
                    setNewFlag({ ...newFlag, environment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expiration Date</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newFlag.expiresAt}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>
            <Button type="submit">Create Feature Flag</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {flags?.map((flag) => (
          <Card key={flag.id} className={flag.isArchived ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {flag.name}
                    <Badge
                      variant={
                        flag.type === "boolean"
                          ? flag.value
                            ? "default"
                            : "secondary"
                          : "default"
                      }
                    >
                      {flag.type === "boolean"
                        ? flag.value
                          ? "Enabled"
                          : "Disabled"
                        : "Enabled"}
                    </Badge>
                    {flag.isArchived && (
                      <Badge variant="destructive">Archived</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{flag.description}</CardDescription>
                </div>
                {!flag.isArchived && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => archiveFlag.mutate(flag.id)}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="settings">
                <TabsList>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <code className="bg-muted px-2 py-1 rounded">
                        {flag.key}
                      </code>
                      <Switch
                        checked={flag.type === "boolean" ? flag.value : false}
                        onCheckedChange={() => toggleMutation.mutate(flag)}
                        disabled={flag.isArchived}
                      />
                    </div>
                    {flag.type === "percentage" && (
                      <div>
                        <Label>Rollout Percentage</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={flag.value?.percentage || 0}
                          onChange={(e) =>
                            updateFlag.mutate({
                              id: flag.id,
                              value: { percentage: Number(e.target.value) },
                            })
                          }
                          disabled={flag.isArchived}
                        />
                      </div>
                    )}
                    {flag.type === "userlist" && (
                      <div>
                        <Label>User IDs</Label>
                        <Input
                          value={flag.value?.users?.join(",") || ""}
                          onChange={(e) =>
                            updateFlag.mutate({
                              id: flag.id,
                              value: {
                                users: e.target.value
                                  .split(",")
                                  .map((s) => s.trim()),
                              },
                            })
                          }
                          disabled={flag.isArchived}
                        />
                      </div>
                    )}
                    {flag.expiresAt && (
                      <div>
                        <Label>Expires At</Label>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(flag.expiresAt), "PPpp")}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <div className="space-y-4">
                    {flag.auditLogs.map((log) => (
                      <div key={log.id} className="text-sm">
                        <p className="font-medium">
                          {log.action.charAt(0).toUpperCase() +
                            log.action.slice(1)}
                        </p>
                        <p className="text-muted-foreground">
                          {format(new Date(log.createdAt), "PPpp")}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
