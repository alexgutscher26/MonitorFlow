"use client"

import { IncidentActions } from "@/components/incident-actions"

interface IncidentActionsWrapperProps {
  categoryName: string
}

export function IncidentActionsWrapper({ categoryName }: IncidentActionsWrapperProps) {
  return <IncidentActions categoryName={categoryName} />
}
