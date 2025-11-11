import { filtersActions } from "@/features/filters"
import { SearchInput } from "@/features/search"
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"
import { Button } from "@/shared/ui"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products) */
  categories?: string[]
  /** Whether any filters are currently active */
  hasActiveFilters: boolean
}

export function ProductsToolbar({
  categories,
  hasActiveFilters,
}: ProductsToolbarProps) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)

  return (
    <div className="flex items-center gap-4 mb-6">
      <SearchInput
        value={filters.search}
        onChange={(value) => dispatch(filtersActions.setSearch(value))}
      />
      <Button
        variant="outline"
        size="md"
        onClick={() => dispatch(filtersActions.resetFilters())}
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
