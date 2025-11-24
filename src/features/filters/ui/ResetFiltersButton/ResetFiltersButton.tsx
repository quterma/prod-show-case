"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { resetFilters, selectHasActiveFilters } from "../../model"

/**
 * Reset filters button
 * Client-side only - no SSR, avoids hydration issues entirely
 */
export function ResetFiltersButton() {
  const dispatch = useAppDispatch()
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <button
      onClick={handleReset}
      disabled={!hasActiveFilters}
      className="px-4 py-2 text-base font-medium rounded-md bg-background text-foreground border border-input hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-150"
    >
      Reset filters
    </button>
  )
}
