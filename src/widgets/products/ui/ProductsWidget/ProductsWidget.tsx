"use client"

import { useEffect, useMemo } from "react"

import {
  useGetProductsQuery,
  useDynamicCategories,
  useDynamicPriceRange,
} from "@/entities/product"
import { useFilteredProducts, selectSearchQuery } from "@/features/filters"
import {
  Pagination,
  makeSelectPaginatedProducts,
  makeSelectTotalPages,
  setMaxPage,
} from "@/features/pagination"
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsGridSkeleton } from "../ProductsGridSkeleton"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  onItemClick?: (id: number) => void
}

/**
 * ProductsWidget - Smart widget for products list
 * Handles data fetching, filtering, and composition of toolbar + grid
 */
export function ProductsWidget({ onItemClick }: ProductsWidgetProps) {
  const dispatch = useAppDispatch()
  const { data, isLoading, error, refetch } = useGetProductsQuery()

  // Filter products using selector-based hook (no debounce - handled in QueryFilter)
  const filteredProducts = useFilteredProducts(data)

  // Create memoized pagination selectors
  const selectPaginatedProducts = useMemo(
    () => makeSelectPaginatedProducts(),
    []
  )
  const selectTotalPages = useMemo(() => makeSelectTotalPages(), [])

  // Get paginated products and total pages
  const paginatedProducts = useAppSelector((state) =>
    selectPaginatedProducts(state, data)
  )
  const totalPages = useAppSelector((state) => selectTotalPages(state, data))

  // Sync maxPage with totalPages (for pagination bounds validation)
  useEffect(() => {
    dispatch(setMaxPage(totalPages))
  }, [totalPages, dispatch])

  // Get search query for EmptyState message
  const searchQuery = useAppSelector(selectSearchQuery)

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
          searchQuery.trim()
            ? "Try adjusting your search query or reset filters."
            : "Try adjusting your filters or reset them to see all products."
        }
      />
    )
  } else {
    gridContent = (
      <>
        <ProductsGrid
          products={paginatedProducts ?? []}
          onItemClick={onItemClick}
        />
        <Pagination totalPages={totalPages} />
      </>
    )
  }

  return (
    <div>
      {/* Toolbar is always visible - provides search/filters access in all states */}
      <ProductsToolbar categories={categories} priceRange={priceRange} />

      {/* Grid area - conditionally rendered based on state */}
      {gridContent}
    </div>
  )
}
