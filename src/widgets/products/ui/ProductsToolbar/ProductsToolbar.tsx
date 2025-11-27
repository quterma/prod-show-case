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
 * Organized into three groups:
 * 1. Filters group (Search, Favorites, Rating, Categories, Price, Reset)
 * 2. Primary action (Create Product)
 * 3. Danger zone (Reset Local Data)
 *
 * Mobile: vertical stack (Filters → Create → Reset)
 * Desktop: horizontal layout (Filters left/center, actions right)
 */
export function ProductsToolbar({
  categories,
  priceRange,
  onCreateProduct,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Mobile: vertical stack, Desktop: horizontal with actions on right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Filters Group */}
        <Card className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {/* Search row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <QueryFilter />
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <ShowOnlyFavoritesToggle />
                <ResetFiltersButton />
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <RatingFilter />
              {categories && <CategoryFilter categories={categories} />}
              {priceRange && <PriceRangeFilter priceRange={priceRange} />}
            </div>
          </div>
        </Card>

        {/* Actions Group - right side on desktop, bottom on mobile */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
          {/* Primary Action */}
          {onCreateProduct && (
            <Button
              onClick={onCreateProduct}
              variant="primary"
              className="flex-1 lg:w-full"
            >
              Create Product
            </Button>
          )}

          {/* Danger Zone */}
          <div className="flex-1 lg:w-full">
            <ResetLocalDataButton />
          </div>
        </div>
      </div>
    </div>
  )
}
