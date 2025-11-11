"use client"

import { useGetProductsQuery } from "@/entities/product"
import { getDynamicCategories } from "@/shared/lib/categories"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { ProductsGrid } from "../ProductsGrid"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  onItemClick?: (id: number) => void
}

export function ProductsWidget({ onItemClick }: ProductsWidgetProps) {
  const { data, isLoading, error, refetch } = useGetProductsQuery()

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  }

  // Empty state
  if (!isLoading && (!data || data.length === 0)) {
    return <EmptyState title="No products found" />
  }

  // Extract dynamic categories from products for filters
  const categories = getDynamicCategories(data ?? [])

  return (
    <div>
      <ProductsToolbar categories={categories} />
      <ProductsGrid
        products={data ?? []}
        isLoading={isLoading}
        onItemClick={onItemClick}
      />
    </div>
  )
}
