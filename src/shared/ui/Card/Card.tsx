import { cn } from "@/shared/lib/utils"

export type CardProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Card component for container styling
 * Semantic tokens: bg-card, text-card-foreground, border-border
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}
