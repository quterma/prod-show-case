"use client"

import { ShowOnlyFavoritesToggle } from "@/features/favorites"
import {
  CategoryFilter,
  PriceRangeFilter,
  QueryFilter,
  RatingFilter,
  ResetFiltersButton,
} from "@/features/filters"
import { Button, Card, ResetLocalDataButton } from "@/shared/ui"

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
 * Organized into two groups:
 * 1. Actions group (Create Product, Reset Local Data) - top row, full width
 * 2. Filters group (Search, Favorites, Rating, Categories, Price, Reset) - bottom card, full width
 */
export function ProductsToolbar({
  categories,
  priceRange,
  onCreateProduct,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Actions Group */}
      <div className="flex flex-row gap-3 justify-between">
        {onCreateProduct && (
          <Button onClick={onCreateProduct} variant="primary">
            Create Product
          </Button>
        )}

        <ResetLocalDataButton />
      </div>

      {/* Filters Group */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <QueryFilter />
            <div className="flex items-center gap-2 sm:shrink-0 justify-between flex-1">
              <ShowOnlyFavoritesToggle />
              <ResetFiltersButton />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 min-h-[72px]">
            <div className="flex items-center gap-3 min-h-[72px]">
              <RatingFilter />
              {categories && <CategoryFilter categories={categories} />}
            </div>
            <div className="flex-1 justify-start sm:justify-end flex items-center">
              {priceRange && <PriceRangeFilter priceRange={priceRange} />}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
