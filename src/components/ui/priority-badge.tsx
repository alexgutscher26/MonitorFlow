import { type PriorityLevel } from '@/lib/ai-priority';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Bell, Info } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  showIcon?: boolean;
}

const priorityConfig = {
  critical: {
    icon: AlertCircle,
    class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  high: {
    icon: AlertTriangle,
    class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  medium: {
    icon: Bell,
    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  low: {
    icon: Info,
    class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
};

export function PriorityBadge({
  priority,
  className,
  showIcon = true,
}: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.class,
        className
      )}
    >
      {showIcon && <Icon className="mr-1.5 h-3 w-3" />}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
