"use client"

import { toggleShowOnlyFavorites } from "@/features/filters/model/filtersSlice"
import { selectShowOnlyFavorites } from "@/features/filters/model/selectors"
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"

/**
 * ShowOnlyFavoritesToggle - toggles between showing all products or only favorites
 * Shows as "All | Favorites" toggle buttons
 * Integrates with filters slice (showOnlyFavorites field)
 */
export function ShowOnlyFavoritesToggle() {
  const dispatch = useAppDispatch()
  const showOnlyFavorites = useAppSelector(selectShowOnlyFavorites)

  const handleToggle = (mode: "all" | "favorites") => {
    const shouldShowFavorites = mode === "favorites"
    // Only dispatch if changing state
    if (shouldShowFavorites !== showOnlyFavorites) {
      dispatch(toggleShowOnlyFavorites())
    }
  }

  return (
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => handleToggle("all")}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          !showOnlyFavorites
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        aria-label="Show all products"
      >
        All
      </button>
      <button
        onClick={() => handleToggle("favorites")}
        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
          showOnlyFavorites
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        aria-label="Show only favorites"
      >
        Favorites
      </button>
    </div>
  )
}
