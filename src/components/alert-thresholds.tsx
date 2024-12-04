"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PlusIcon, Trash2 } from "lucide-react"
import { useState } from "react"

interface AlertThreshold {
  id: string
  name: string
  condition: "GREATER_THAN" | "LESS_THAN" | "EQUALS" | "CONTAINS" | "NOT_CONTAINS"
  fieldPath: string
  threshold: string
  enabled: boolean
}

interface AlertThresholdsProps {
  categoryName: string
}

export const AlertThresholds = ({ categoryName }: AlertThresholdsProps) => {
  const queryClient = useQueryClient()
  const [newThreshold, setNewThreshold] = useState({
    name: "",
    condition: "EQUALS" as const,
    fieldPath: "",
    threshold: "",
  })

  const { data: thresholds, isPending } = useQuery({
    queryKey: ["alert-thresholds", categoryName],
    queryFn: async () => {
      const res = await client.category.getAlertThresholds.$get({
        categoryName,
      })
      const { alertThresholds } = await res.json()
      return alertThresholds as AlertThreshold[]
    },
  })

  const { mutate: createThreshold } = useMutation({
    mutationFn: async () => {
      await client.category.createAlertThreshold.$post({
        ...newThreshold,
        categoryName,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-thresholds"] })
      setNewThreshold({
        name: "",
        condition: "EQUALS",
        fieldPath: "",
        threshold: "",
      })
    },
  })

  const { mutate: updateThreshold } = useMutation({
    mutationFn: async ({
      id,
      enabled,
    }: {
      id: string
      enabled: boolean
    }) => {
      await client.category.updateAlertThreshold.$post({
        id,
        enabled,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-thresholds"] })
    },
  })

  const { mutate: deleteThreshold } = useMutation({
    mutationFn: async (id: string) => {
      await client.category.deleteAlertThreshold.$post({
        id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-thresholds"] })
    },
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg/7 font-medium tracking-tight text-gray-950 mb-6">
          Create Alert Threshold
        </h3>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={newThreshold.name}
              onChange={(e) =>
                setNewThreshold({ ...newThreshold, name: e.target.value })
              }
              placeholder="e.g., High Revenue Alert"
            />
          </div>

          <div>
            <Label>Field Path</Label>
            <Input
              value={newThreshold.fieldPath}
              onChange={(e) =>
                setNewThreshold({ ...newThreshold, fieldPath: e.target.value })
              }
              placeholder="e.g., amount"
            />
          </div>

          <div>
            <Label>Condition</Label>
            <Select
              value={newThreshold.condition}
              onValueChange={(value: any) =>
                setNewThreshold({ ...newThreshold, condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GREATER_THAN">Greater Than</SelectItem>
                <SelectItem value="LESS_THAN">Less Than</SelectItem>
                <SelectItem value="EQUALS">Equals</SelectItem>
                <SelectItem value="CONTAINS">Contains</SelectItem>
                <SelectItem value="NOT_CONTAINS">Does Not Contain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Threshold Value</Label>
            <Input
              value={newThreshold.threshold}
              onChange={(e) =>
                setNewThreshold({ ...newThreshold, threshold: e.target.value })
              }
              placeholder="e.g., 1000"
            />
          </div>

          <Button
            onClick={() => createThreshold()}
            className="w-full"
            disabled={
              !newThreshold.name ||
              !newThreshold.fieldPath ||
              !newThreshold.threshold
            }
          >
            <PlusIcon className="size-4 mr-2" />
            Add Threshold
          </Button>
        </div>
      </Card>

      {thresholds && thresholds.length > 0 ? (
        <Card className="p-6">
          <h3 className="text-lg/7 font-medium tracking-tight text-gray-950 mb-6">
            Active Thresholds
          </h3>

          <div className="space-y-4">
            {thresholds.map((threshold) => (
              <div
                key={threshold.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{threshold.name}</p>
                  <p className="text-sm text-gray-600">
                    {threshold.fieldPath}{" "}
                    {threshold.condition.toLowerCase().replace("_", " ")}{" "}
                    {threshold.threshold}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={threshold.enabled}
                      onCheckedChange={(checked) =>
                        updateThreshold({
                          id: threshold.id,
                          enabled: checked,
                        })
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {threshold.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => deleteThreshold(threshold.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
