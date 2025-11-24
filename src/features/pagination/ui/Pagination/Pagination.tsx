"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { selectCurrentPage, setCurrentPage } from "../../model"

type PaginationProps = {
  /** Total number of pages */
  totalPages: number
}

/**
 * Pagination component - self-contained navigation controls
 * Shows "< Prev | Page X of Y | Next >" with disabled states
 * Always visible (even for 1 page) to avoid confusion when filters change page count
 */
export function Pagination({ totalPages }: PaginationProps) {
  const dispatch = useAppDispatch()
  const currentPage = useAppSelector(selectCurrentPage)

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePrev = () => {
    if (canGoPrev) {
      dispatch(setCurrentPage(currentPage - 1))
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      dispatch(setCurrentPage(currentPage + 1))
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background transition-colors"
        aria-label="Previous page"
      >
        Previous
      </button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  )
}
