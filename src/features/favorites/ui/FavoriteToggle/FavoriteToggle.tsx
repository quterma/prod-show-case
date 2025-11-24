"use client"

import { useMemo } from "react"
import toast from "react-hot-toast"

import type { ProductId } from "@/entities/product"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { toggleFavorite, makeSelectIsFavorite } from "../../model"

type FavoriteToggleProps = {
  /** Product ID to toggle favorite status */
  productId: ProductId
  /** Optional additional CSS classes */
  className?: string
}

/**
 * FavoriteToggle - toggles favorite status for a product
 * Shows filled heart if favorited, outline heart if not
 * Integrates with Redux favorites slice
 */
export function FavoriteToggle({
  productId,
  className = "",
}: FavoriteToggleProps) {
  const dispatch = useAppDispatch()

  // Create memoized selector instance for this product
  const selectIsFavorite = useMemo(() => makeSelectIsFavorite(), [])
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, productId)
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking favorite button
    dispatch(toggleFavorite(productId))

    if (isFavorite) {
      toast.success("Removed from favorites")
    } else {
      toast.success("Added to favorites")
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`group p-2 rounded-full transition-colors hover:bg-accent ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className={`w-5 h-5 transition-colors ${
          isFavorite
            ? "text-destructive group-hover:text-destructive/90"
            : "text-muted-foreground group-hover:text-destructive"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}
