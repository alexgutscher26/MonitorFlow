"use client";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface PercentageRolloutProps {
  flagKey: string;
  environment?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PercentageRollout({
  flagKey,
  environment = "production",
  children,
  fallback = null,
}: PercentageRolloutProps) {
  const isEnabled = useFeatureFlag(flagKey, environment);

  if (!isEnabled) {
    return fallback;
  }

  return children;
}
