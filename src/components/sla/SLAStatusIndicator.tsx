import { cn } from "@/utils";

interface SLAStatusIndicatorProps {
  currentUptime: number;
  target: number;
  className?: string;
}

export function SLAStatusIndicator({ currentUptime, target, className }: SLAStatusIndicatorProps) {
  // Calculate status
  const getStatus = () => {
    if (currentUptime >= target) {
      return "success";
    } else if (currentUptime >= target - 5) {
      // Warning if within 5% of target
      return "warning";
    }
    return "error";
  };

  const status = getStatus();

  const statusColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const statusText = {
    success: "Meeting SLA",
    warning: "At Risk",
    error: "Below Target",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full animate-pulse",
          statusColors[status]
        )}
      />
      <span className="text-sm text-muted-foreground">
        {statusText[status]}
      </span>
    </div>
  );
}
