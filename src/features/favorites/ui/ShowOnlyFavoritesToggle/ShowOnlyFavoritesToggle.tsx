"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { toggleShowOnlyFavorites, selectShowOnlyFavorites } from "../../model"

/**
 * ShowOnlyFavoritesToggle - toggles between showing all products or only favorites
 * Shows as "All | Favorites" toggle buttons
 * Integrates with favorites slice (showOnlyFavorites field)
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
    <div className="flex border border-input rounded-lg overflow-hidden">
      <button
        onClick={() => handleToggle("all")}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          !showOnlyFavorites
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground hover:bg-accent"
        }`}
        aria-label="Show all products"
      >
        All
      </button>
      <button
        onClick={() => handleToggle("favorites")}
        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-input ${
          showOnlyFavorites
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground hover:bg-accent"
        }`}
        aria-label="Show only favorites"
      >
        Favorites
      </button>
    </div>
  )
}
