"use client"

import dynamic from "next/dynamic"

import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"

import { resetFilters, selectHasActiveFilters } from "../../model"

/**
 * Client-only reset filters button to avoid hydration mismatch
 * Uses dynamic import with ssr: false
 */
function ResetFiltersButtonClient() {
  const dispatch = useAppDispatch()
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <button
      onClick={handleReset}
      disabled={!hasActiveFilters}
      className="
        px-4 py-2 text-base
        font-medium rounded-md
        bg-white text-gray-700 border border-gray-300
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60
        transition-colors duration-150
      "
    >
      Reset filters
    </button>
  )
}

// Export dynamic component with fallback
export const ResetFiltersButton = dynamic(
  () => Promise.resolve(ResetFiltersButtonClient),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="
        px-4 py-2 text-base
        font-medium rounded-md
        bg-gray-50 text-gray-400 border border-gray-300
        cursor-not-allowed opacity-60
        transition-colors duration-150
      "
      >
        Reset filters
      </button>
    ),
  }
)
