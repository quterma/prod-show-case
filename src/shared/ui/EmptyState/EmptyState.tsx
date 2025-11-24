import { Inbox } from "lucide-react"

import { cn } from "@/shared/lib/utils"

type EmptyStateProps = {
  title?: string
  description?: string
  note?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "No data",
  description,
  note,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const content = description || note

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        {icon || <Inbox className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {content && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{content}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
