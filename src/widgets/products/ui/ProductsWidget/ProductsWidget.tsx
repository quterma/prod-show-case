"use client"

import { useMemo } from "react"

import { useGetProductsQuery } from "@/entities/product"
import type { Product } from "@/entities/product/model"
import { useSearch } from "@/features/search"
import { useDynamicCategories } from "@/shared/lib/categories"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  onItemClick?: (id: number) => void
}

/**
 * Filter products by search query (case-insensitive)
 */
function filterProductsBySearch(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const lowerQuery = query.toLowerCase()

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  )
}

export function ProductsWidget({ onItemClick }: ProductsWidgetProps) {
  const { data, isLoading, error, refetch } = useGetProductsQuery()
  const { searchQuery, debouncedQuery, setSearchQuery } = useSearch()

  // Filter products by search query
  const filteredProducts = useMemo(
    () => filterProductsBySearch(data ?? [], debouncedQuery),
    [data, debouncedQuery]
  )

  // Extract dynamic categories from products for filters (memoized)
  const categories = useDynamicCategories(data)

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  }

  // Empty state (no products loaded)
  if (!isLoading && (!data || data.length === 0)) {
    return <EmptyState title="No products found" />
  }

  // No results after filtering
  if (!isLoading && filteredProducts.length === 0 && debouncedQuery) {
    return <EmptyState title={`No products found for "${debouncedQuery}"`} />
  }

  return (
    <div>
      <ProductsToolbar
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ProductsGrid
        products={filteredProducts}
        isLoading={isLoading}
        onItemClick={onItemClick}
      />
    </div>
  )
}
