"use client"

import { ShowOnlyFavoritesToggle } from "@/features/favorites"
import {
  CategoryFilter,
  PriceRangeFilter,
  QueryFilter,
  RatingFilter,
  ResetFiltersButton,
} from "@/features/filters"
import { ResetLocalDataButton } from "@/features/reset-local-data"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products), undefined if no valid categories */
  categories?: string[]
  /** Available price range from products, undefined if no valid prices */
  priceRange?: { min: number; max: number }
}

/**
 * ProductsToolbar - Composition of filter components
 * Client-side component to avoid hydration issues with Redux-connected filters
 * Only receives domain props (categories, priceRange)
 * All filter components are self-contained and connect to Redux directly
 */
export function ProductsToolbar({
  categories,
  priceRange,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search and Reset row */}
      <div className="flex items-center gap-4 justify-between">
        <QueryFilter />
        <div className="flex items-center gap-3">
          <ResetFiltersButton />
          <ShowOnlyFavoritesToggle />
          <ResetLocalDataButton />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-6">
        <RatingFilter />
        {categories && <CategoryFilter categories={categories} />}
        {priceRange && <PriceRangeFilter priceRange={priceRange} />}
      </div>
    </div>
  )
}
