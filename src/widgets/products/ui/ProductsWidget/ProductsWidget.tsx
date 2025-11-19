"use client"

import { useState } from "react"

import type { ProductId } from "@/entities/product"
import { Pagination } from "@/features/pagination"
import { ErrorMessage, EmptyState } from "@/shared/ui"
import { ProductFormDialogWidget } from "@/widgets/product-form-dialog"

import { useProductsView } from "../../hooks"
import { ProductsGrid } from "../ProductsGrid"
import { ProductsGridSkeleton } from "../ProductsGridSkeleton"
import { ProductsToolbar } from "../ProductsToolbar"

type ProductsWidgetProps = {
  onItemClick?: (id: ProductId) => void
}

/**
 * ProductsWidget - Smart widget for products list
 * Handles data fetching, filtering, and composition of toolbar + grid
 */
export function ProductsWidget({ onItemClick }: ProductsWidgetProps) {
  // Local state for create product dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Handlers for dialog control
  const handleOpenModal = () => setIsCreateDialogOpen(true)
  const handleCloseModal = () => setIsCreateDialogOpen(false)

  // Use aggregator hook for complete data pipeline
  const {
    paginatedProducts,
    totalPages,
    categories,
    priceRange,
    isLoading,
    error,
    emptyState,
    refetch,
  } = useProductsView()

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
  } else if (emptyState === "emptyAPIData") {
    gridContent = (
      <EmptyState
        title="No products available"
        note="The server returned an empty product list. Please try again later or contact support."
      />
    )
  } else if (emptyState === "emptyLocalData") {
    gridContent = (
      <EmptyState
        title="No products available"
        note="All products have been deleted. Try resetting your local data."
      />
    )
  } else if (emptyState === "emptyFavoriteData") {
    gridContent = (
      <EmptyState
        title="No favorite products"
        note="You haven't added any products to favorites yet. Browse products and click the heart icon to add them."
      />
    )
  } else if (emptyState === "emptyFilteredData") {
    gridContent = (
      <EmptyState
        title="No products match your filters"
        note="Try adjusting your filters or reset them to see all products."
      />
    )
  } else {
    gridContent = (
      <>
        <ProductsGrid products={paginatedProducts} onItemClick={onItemClick} />
        <Pagination totalPages={totalPages} />
      </>
    )
  }

  return (
    <div>
      {/* Toolbar is always visible - provides search/filters access in all states */}
      <ProductsToolbar
        categories={categories}
        priceRange={priceRange}
        onCreateProduct={handleOpenModal}
      />

      {/* Grid area - conditionally rendered based on state */}
      {gridContent}

      {/* Create product dialog */}
      <ProductFormDialogWidget
        mode="create"
        open={isCreateDialogOpen}
        onCloseDialog={handleCloseModal}
      />
    </div>
  )
}
