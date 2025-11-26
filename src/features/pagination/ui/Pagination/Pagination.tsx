"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { Button } from "@/shared/ui"

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
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Previous page"
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  )
}
