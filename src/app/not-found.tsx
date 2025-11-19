import { EmptyState } from "@/shared/ui"

/**
 * Global 404 page - shown when route is not found
 * Triggered by Next.js automatically or via notFound()
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="404 - Page Not Found"
        note="The page you're looking for doesn't exist or has been moved."
      />
    </div>
  )
}
