import { cn } from "@/shared/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Skeleton component for loading states
 * Shows a pulsing gray block
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
