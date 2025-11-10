type EmptyStateProps = {
  title?: string
  note?: string
}

export function EmptyState({ title = "No data", note }: EmptyStateProps) {
  return (
    <div>
      <h3>{title}</h3>
      {note && <p>{note}</p>}
    </div>
  )
}
