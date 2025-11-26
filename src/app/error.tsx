"use client"

import { logger } from "@/shared/lib/logger"
import { Button, EmptyState } from "@/shared/ui"

/**
 * Global Error Boundary - catches unhandled errors in the app
 * Next.js error.tsx convention
 *
 * This handles fatal errors that aren't caught by component-level error handling.
 * Business errors (API failures, not found, etc.) should be handled in widgets.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log error in development, can be switched to external service in production
  if (typeof window !== "undefined") {
    logger.error("Global error caught:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Something went wrong"
        note={
          process.env.NODE_ENV === "development"
            ? `Error: ${error.message}`
            : "An unexpected error occurred. Please try again."
        }
        action={
          <div className="flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        }
      />
    </div>
  )
}
