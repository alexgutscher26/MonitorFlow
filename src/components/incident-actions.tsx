"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"

const actionTypes = [
  { value: "DISCORD_NOTIFICATION", label: "Discord Notification" },
  { value: "WEBHOOK", label: "Webhook" },
  { value: "EMAIL", label: "Email" },
  { value: "RETRY_CHECK", label: "Retry Check" },
  { value: "PAUSE_MONITORING", label: "Pause Monitoring" },
]

interface IncidentActionsProps {
  categoryName: string
}

export function IncidentActions({ categoryName }: IncidentActionsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [newAction, setNewAction] = useState({
    name: "",
    description: "",
    actionType: "DISCORD_NOTIFICATION",
    config: "{}",
    conditions: "{}",
    priority: "1",
    cooldownMinutes: "5",
    enabled: true,
  })

  const { data: actions, isLoading } = useQuery({
    queryKey: ["incident-actions", categoryName],
    queryFn: async () => {
      const response = await client.category.getIncidentActions.$query({
        categoryName
      })
      return response.actions
    }
  })

  const createMutation = useMutation({
    mutationFn: async (action: any) => {
      const response = await client.category.createIncidentAction.$post({
        json: {
          categoryName,
          ...action,
        }
      })
      return response.action
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      setIsCreating(false)
      setNewAction({
        name: "",
        description: "",
        actionType: "DISCORD_NOTIFICATION",
        config: "{}",
        conditions: "{}",
        priority: "1",
        cooldownMinutes: "5",
        enabled: true,
      })
      toast({
        title: "Success",
        description: "Incident action created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const response = await client.category.updateIncidentAction.$post({
        json: {
          categoryName,
          id,
          enabled,
        }
      })
      return response.action
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      toast({
        title: "Success",
        description: "Incident action updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await client.category.deleteIncidentAction.$post({
        json: {
          categoryName,
          id,
        }
      })
      return response.success
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-actions"] })
      toast({
        title: "Success",
        description: "Incident action deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Incident Actions</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          Create Action
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate({
                ...newAction,
                priority: parseInt(newAction.priority),
                cooldownMinutes: parseInt(newAction.cooldownMinutes),
                config: JSON.parse(newAction.config),
                conditions: JSON.parse(newAction.conditions),
              })
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAction.name}
                onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAction.description}
                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={newAction.actionType}
                onValueChange={(value) => setNewAction({ ...newAction, actionType: value })}
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
                onChange={(e) => setNewAction({ ...newAction, config: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="conditions">Conditions (JSON)</Label>
              <Textarea
                id="conditions"
                value={newAction.conditions}
                onChange={(e) => setNewAction({ ...newAction, conditions: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={newAction.priority}
                  onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cooldown">Cooldown (minutes)</Label>
                <Input
                  id="cooldown"
                  type="number"
                  min="0"
                  value={newAction.cooldownMinutes}
                  onChange={(e) => setNewAction({ ...newAction, cooldownMinutes: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newAction.enabled}
                onCheckedChange={(checked) => setNewAction({ ...newAction, enabled: checked })}
              />
              <Label>Enabled</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Create
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {actions?.map((action: any) => (
          <Card key={action.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{action.name}</h3>
                {action.description && (
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={action.enabled}
                  onCheckedChange={(checked) =>
                    toggleMutation.mutate({ id: action.id, enabled: checked })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this action?")) {
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
                <span className="font-medium">Priority:</span> {action.priority}
              </div>
              <div>
                <span className="font-medium">Cooldown:</span> {action.cooldownMinutes} minutes
              </div>
              <div>
                <span className="font-medium">Last Triggered:</span>{" "}
                {action.lastTriggered
                  ? new Date(action.lastTriggered).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
