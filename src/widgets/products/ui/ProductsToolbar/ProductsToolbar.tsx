"use client"

import { ShowOnlyFavoritesToggle } from "@/features/favorites"
import {
  CategoryFilter,
  PriceRangeFilter,
  QueryFilter,
  RatingFilter,
  ResetFiltersButton,
} from "@/features/filters"
import { Button, ResetLocalDataButton } from "@/shared/ui"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products), undefined if no valid categories */
  categories?: string[]
  /** Available price range from products, undefined if no valid prices */
  priceRange?: { min: number; max: number }
  /** Callback when create product button is clicked */
  onCreateProduct?: () => void
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
  onCreateProduct,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Search and Actions row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <QueryFilter />
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {onCreateProduct && (
            <Button
              onClick={onCreateProduct}
              variant="primary"
              className="flex-1 sm:flex-none"
            >
              Create Product
            </Button>
          )}
          <ResetFiltersButton />
          <ShowOnlyFavoritesToggle />
          <ResetLocalDataButton />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 p-4 bg-card border border-border rounded-lg">
        <RatingFilter />
        <div className="h-px w-full sm:h-8 sm:w-px bg-border" />
        {categories && <CategoryFilter categories={categories} />}
        <div className="h-px w-full sm:h-8 sm:w-px bg-border" />
        {priceRange && <PriceRangeFilter priceRange={priceRange} />}
      </div>
    </div>
  )
}
