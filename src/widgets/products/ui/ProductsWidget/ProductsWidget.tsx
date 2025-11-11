"use client"

import { useGetProductsQuery, useDynamicCategories } from "@/entities/product"
import { useProductFilters } from "@/features/filters"
import { useAppSelector } from "@/shared/lib/hooks"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  onItemClick?: (id: number) => void
}

export function ProductsWidget({ onItemClick }: ProductsWidgetProps) {
  const { data, isLoading, error, refetch } = useGetProductsQuery()

  // Filter products with composite hook (uses Redux state internally)
  const { filteredProducts, hasActiveFilters } = useProductFilters(data)

  // Get filters state from Redux for EmptyState message
  const filters = useAppSelector((state) => state.filters)

  // Extract dynamic categories from products for filters (memoized)
  const categories = useDynamicCategories(data)

  // Error state - show only error message without toolbar
  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  }

  // Empty state (no products loaded from API - server returned empty array)
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <EmptyState
        title="No products available"
        note="The server returned an empty product list. Please try again later or contact support."
      />
    )
  }

  // Determine what to show in the grid area
  const hasResults = filteredProducts.length > 0

  return (
    <div>
      <ProductsToolbar
        categories={categories}
        hasActiveFilters={hasActiveFilters}
      />
      {isLoading ? (
        <ProductsGrid
          products={[]}
          isLoading={true}
          onItemClick={onItemClick}
        />
      ) : hasResults ? (
        <ProductsGrid
          products={filteredProducts}
          isLoading={false}
          onItemClick={onItemClick}
        />
      ) : (
        <EmptyState
          title="No products match your filters"
          note={
            filters.search.trim()
              ? `Try adjusting your search query or reset filters.`
              : "Try adjusting your filters or reset them to see all products."
          }
        />
      )}
    </div>
  )
}
