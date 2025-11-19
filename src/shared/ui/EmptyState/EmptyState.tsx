type EmptyStateProps = {
  title?: string
  note?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = "No data",
  note,
  action,
}: EmptyStateProps) {
  return (
    <div>
      <h3>{title}</h3>
      {note && <p>{note}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
