"use client";

import { useFeatureFlags } from "@/providers/FeatureFlagProvider";

interface FeatureFlagProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  const { checkFlag } = useFeatureFlags();
  return checkFlag(flag) ? children : fallback;
}

export function FeatureFlags({ flags, children, fallback = null }: { flags: string[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const { checkFlag } = useFeatureFlags();
  return flags.every(checkFlag) ? children : fallback;
}
