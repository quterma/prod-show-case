"use client"

import {
  useGetProductsQuery,
  useDynamicCategories,
  useDynamicPriceRange,
} from "@/entities/product"
import { useProductFilters } from "@/features/filters"
import { useAppSelector } from "@/shared/lib/hooks"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsGridSkeleton } from "../ProductsGridSkeleton"
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

  // Extract dynamic categories and price range from products (memoized)
  const categories = useDynamicCategories(data)
  const priceRange = useDynamicPriceRange(data)

  // Determine what to render in the grid area based on state
  let gridContent: React.ReactNode

  if (error) {
    gridContent = (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  } else if (isLoading) {
    gridContent = <ProductsGridSkeleton />
  } else if (!data || data.length === 0) {
    gridContent = (
      <EmptyState
        title="No products available"
        note="The server returned an empty product list. Please try again later or contact support."
      />
    )
  } else if (!filteredProducts || filteredProducts.length === 0) {
    gridContent = (
      <EmptyState
        title="No products match your filters"
        note={
          filters.searchQuery.trim()
            ? "Try adjusting your search query or reset filters."
            : "Try adjusting your filters or reset them to see all products."
        }
      />
    )
  } else {
    gridContent = (
      <ProductsGrid products={filteredProducts} onItemClick={onItemClick} />
    )
  }

  return (
    <div>
      {/* Toolbar is always visible - provides search/filters access in all states */}
      <ProductsToolbar
        categories={categories}
        priceRange={priceRange}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Grid area - conditionally rendered based on state */}
      {gridContent}
    </div>
  )
}
