"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { cn } from "@/shared/lib/utils"

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
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
          !showOnlyFavorites
            ? "bg-primary text-primary-foreground"
            : "bg-background dark:bg-secondary/10 text-foreground hover:bg-accent"
        )}
        aria-label="Show all products"
      >
        All
      </button>
      <button
        onClick={() => handleToggle("favorites")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors duration-150 border-l border-input cursor-pointer",
          showOnlyFavorites
            ? "bg-primary text-primary-foreground"
            : "bg-background dark:bg-secondary/10 text-foreground hover:bg-accent"
        )}
        aria-label="Show only favorites"
      >
        Favorites
      </button>
    </div>
  )
}
