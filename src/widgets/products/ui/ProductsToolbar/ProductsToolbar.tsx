import type {
  ProductFiltersState,
  ProductFiltersSetters,
} from "@/features/filters"
import { SearchInput } from "@/features/search"
import { Button } from "@/shared/ui"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products) */
  categories?: string[]
  /** Current filter state */
  filters: ProductFiltersState
  /** Filter setters */
  setters: ProductFiltersSetters
  /** Whether any filters are currently active */
  hasActiveFilters: boolean
}

export function ProductsToolbar({
  categories,
  filters,
  setters,
  hasActiveFilters,
}: ProductsToolbarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <SearchInput value={filters.search} onChange={setters.setSearch} />
      <Button
        variant="outline"
        size="md"
        onClick={setters.resetFilters}
        disabled={!hasActiveFilters}
      >
        Reset filters
      </Button>
      {/* TODO: Implement category/price/favorites filters */}
      {categories && categories.length > 0 && (
        <p className="text-sm text-gray-600">
          Available categories: {categories.join(", ")}
        </p>
      )}
    </div>
  )
}
