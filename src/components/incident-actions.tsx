"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Card } from "./ui/card"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

const ACTION_TYPES = [
  { value: "DISCORD_NOTIFICATION", label: "Discord Notification" },
  { value: "WEBHOOK", label: "Webhook" },
  { value: "EMAIL", label: "Email" },
  { value: "RETRY_CHECK", label: "Retry Check" },
  { value: "PAUSE_MONITORING", label: "Pause Monitoring" },
] as const

type ActionType = (typeof ACTION_TYPES)[number]["value"]

interface IncidentAction {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  categoryId: string
  actionType: ActionType
  config: Record<string, unknown> | null
  conditions: Record<string, unknown> | null
  cooldownMinutes: number
  lastTriggered: string | null
}

interface NewIncidentAction {
  name: string
  description: string
  actionType: ActionType
  config: string
  conditions: string
  cooldownMinutes: string
  enabled: boolean
}

interface IncidentActionsProps {
  categoryName: string
}

<<<<<<< HEAD
type IncidentAction = {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
  enabled: boolean
  categoryId: string
  actionType:
    | "DISCORD_NOTIFICATION"
    | "WEBHOOK"
    | "EMAIL"
    | "RETRY_CHECK"
    | "PAUSE_MONITORING"
  config: Record<string, any> | null
  conditions: Record<string, any> | null
  cooldownMinutes: number
  lastTriggered: string | null
=======
const DEFAULT_NEW_ACTION: NewIncidentAction = {
  name: "",
  description: "",
  actionType: "DISCORD_NOTIFICATION",
  config: "{}",
  conditions: "{}",
  cooldownMinutes: "5",
  enabled: true,
>>>>>>> main
}

export function IncidentActions({ categoryName }: IncidentActionsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [newAction, setNewAction] =
    useState<NewIncidentAction>(DEFAULT_NEW_ACTION)

  const {
    data: actions,
    isLoading,
    error,
  } = useQuery<IncidentAction[]>({
    queryKey: ["incident-actions", categoryName],
    queryFn: async () => {
      const response = await client.category.getIncidentActions.$get({
        categoryName,
      })
      const data = await response.json()
      return data.actions
    },
  })

  const createMutation = useMutation({
    mutationFn: async (action: NewIncidentAction) => {
      try {
        const config = JSON.parse(action.config)
        const conditions = JSON.parse(action.conditions)

        const response = await client.category.createIncidentAction.$post({
          categoryName,
          name: action.name,
          actionType: action.actionType,
          description: action.description,
          config,
          conditions,
          cooldownMinutes: parseInt(action.cooldownMinutes, 10),
          enabled: action.enabled,
        })
        return response
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error("Invalid JSON in config or conditions")
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      setIsCreating(false)
      setNewAction(DEFAULT_NEW_ACTION)
      toast({
        title: "Success",
        description: "Incident action created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating action",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const response = await client.category.updateIncidentAction.$post({
        categoryName,
        id,
        enabled,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      toast({
        title: "Success",
        description: "Incident action updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating action",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await client.category.deleteIncidentAction.$post({
        id,
        categoryName,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      toast({
        title: "Success",
        description: "Incident action deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting action",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load incident actions. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Incident Actions</h2>
          <p className="text-sm text-muted-foreground">
            Configure automated actions that trigger during incidents
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
          className="whitespace-nowrap"
        >
          Create Action
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate(newAction)
            }}
            className="space-y-4"
          >
<<<<<<< HEAD
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAction.name}
                onChange={(e) =>
                  setNewAction({ ...newAction, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAction.description}
                onChange={(e: { target: { value: any } }) =>
                  setNewAction({ ...newAction, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={newAction.actionType}
                onValueChange={(value) =>
                  setNewAction({ ...newAction, actionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="config">Configuration (JSON)</Label>
              <Textarea
                id="config"
                value={newAction.config}
                onChange={(e: { target: { value: any } }) =>
                  setNewAction({ ...newAction, config: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="conditions">Conditions (JSON)</Label>
              <Textarea
                id="conditions"
                value={newAction.conditions}
                onChange={(e: { target: { value: any } }) =>
                  setNewAction({ ...newAction, conditions: e.target.value })
                }
                required
              />
            </div>
=======
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAction.name}
                  onChange={(e) =>
                    setNewAction({ ...newAction, name: e.target.value })
                  }
                  placeholder="Enter action name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAction.description}
                  onChange={(e) =>
                    setNewAction({ ...newAction, description: e.target.value })
                  }
                  placeholder="Describe what this action does"
                  className="h-20"
                />
              </div>

              <div>
                <Label htmlFor="actionType">Action Type</Label>
                <Select
                  value={newAction.actionType}
                  onValueChange={(value: ActionType) =>
                    setNewAction({ ...newAction, actionType: value })
                  }
                >
                  <SelectTrigger id="actionType">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="config">Configuration (JSON)</Label>
                <Textarea
                  id="config"
                  value={newAction.config}
                  onChange={(e) =>
                    setNewAction({ ...newAction, config: e.target.value })
                  }
                  placeholder="{}"
                  className="font-mono h-32"
                  required
                />
              </div>

              <div>
                <Label htmlFor="conditions">Conditions (JSON)</Label>
                <Textarea
                  id="conditions"
                  value={newAction.conditions}
                  onChange={(e) =>
                    setNewAction({ ...newAction, conditions: e.target.value })
                  }
                  placeholder="{}"
                  className="font-mono h-32"
                  required
                />
              </div>
>>>>>>> main

              <div>
                <Label htmlFor="cooldown">Cooldown (minutes)</Label>
                <Input
                  id="cooldown"
                  type="number"
                  min="0"
                  value={newAction.cooldownMinutes}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      cooldownMinutes: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newAction.enabled}
                  onCheckedChange={(checked) =>
                    setNewAction({ ...newAction, enabled: checked })
                  }
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
            </div>

<<<<<<< HEAD
            <div className="flex items-center space-x-2">
              <Switch
                checked={newAction.enabled}
                onCheckedChange={(checked: any) =>
                  setNewAction({ ...newAction, enabled: checked })
                }
              />
              <Label>Enabled</Label>
            </div>

            <div className="flex justify-end space-x-2">
=======
            <div className="flex justify-end space-x-2 pt-4">
>>>>>>> main
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewAction(DEFAULT_NEW_ACTION)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="min-w-24"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
<<<<<<< HEAD
        {actions?.map((action) => (
          <Card key={action.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{action.name}</h3>
                {action.description && (
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={action.enabled}
                  onCheckedChange={(checked: any) =>
                    toggleMutation.mutate({ id: action.id, enabled: checked })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this action?")
                    ) {
                      deleteMutation.mutate(action.id)
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Type:</span>{" "}
                {actionTypes.find((t) => t.value === action.actionType)?.label}
              </div>
              <div>
                <span className="font-medium">Cooldown:</span>{" "}
                {action.cooldownMinutes} minutes
              </div>
              <div>
                <span className="font-medium">Last Triggered:</span>{" "}
                {action.lastTriggered
                  ? new Date(action.lastTriggered).toLocaleString()
                  : "Never"}
              </div>
=======
        {isLoading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading actions...
>>>>>>> main
            </div>
          </Card>
        ) : actions?.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              No incident actions configured yet
            </div>
          </Card>
        ) : (
          actions?.map((action) => (
            <Card key={action.id} className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{action.name}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {
                        ACTION_TYPES.find((t) => t.value === action.actionType)
                          ?.label
                      }
                    </span>
                  </div>
                  {action.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Cooldown: {action.cooldownMinutes} minutes
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({ id: action.id, enabled: checked })
                    }
                    disabled={toggleMutation.isPending}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this action?"
                        )
                      ) {
                        deleteMutation.mutate(action.id)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
