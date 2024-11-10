import { cn } from "@/utils";

/**
 * Skeleton component for displaying a loading placeholder with a pulsing animation.
 * Useful for indicating loading states for UI elements like cards or lists.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @returns {JSX.Element} Rendered Skeleton component
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
