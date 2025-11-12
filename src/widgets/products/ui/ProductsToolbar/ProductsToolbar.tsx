import {
  CategoryFilter,
  PriceRangeFilter,
  RatingFilter,
} from "@/features/filters"
import * as filtersActions from "@/features/filters/model/filtersSlice"
import { SearchInput } from "@/features/search"
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"
import { Button } from "@/shared/ui"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products), undefined if no valid categories */
  categories?: string[]
  /** Available price range from products, undefined if no valid prices */
  priceRange?: { min: number; max: number }
  /** Whether any filters are currently active */
  hasActiveFilters: boolean
}

export function ProductsToolbar({
  categories,
  priceRange,
  hasActiveFilters,
}: ProductsToolbarProps) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search and Reset row */}
      <div className="flex items-center gap-4">
        <SearchInput
          value={filters.searchQuery}
          onChange={(value) => dispatch(filtersActions.setSearchQuery(value))}
        />
        <Button
          variant="outline"
          size="md"
          onClick={() => dispatch(filtersActions.resetFilters())}
          disabled={!hasActiveFilters}
        >
          Reset filters
        </Button>
      </div>

      {/* Filters row - conditional rendering based on available data */}
      <div className="flex flex-wrap items-center gap-6">
        {categories && <CategoryFilter categories={categories} />}
        {priceRange && <PriceRangeFilter priceRange={priceRange} />}
        <RatingFilter />
      </div>
    </div>
  )
}
