"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"

import { selectCurrentPage, setPage } from "../../model"

type PaginationProps = {
  /** Total number of pages */
  totalPages: number
}

/**
 * Pagination component - self-contained navigation controls
 * Shows "< Prev | Page X of Y | Next >" with disabled states
 * Only renders if totalPages > 1
 */
export function Pagination({ totalPages }: PaginationProps) {
  const dispatch = useAppDispatch()
  const currentPage = useAppSelector(selectCurrentPage)

  if (totalPages <= 1) return null

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePrev = () => {
    if (canGoPrev) {
      dispatch(setPage(currentPage - 1))
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      dispatch(setPage(currentPage + 1))
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        aria-label="Previous page"
      >
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  )
}
