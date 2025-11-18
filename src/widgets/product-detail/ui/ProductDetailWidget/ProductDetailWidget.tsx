"use client"

import { useState } from "react"

import {
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "@/entities/product"
import { Button, ErrorMessage, EmptyState } from "@/shared/ui"
import { ProductFormDialogWidget } from "@/widgets/product-form-dialog"

import { useProductView } from "../../hooks"

type ProductDetailWidgetProps = {
  productId: number
}

export function ProductDetailWidget({ productId }: ProductDetailWidgetProps) {
  // Local state for edit product dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Handlers for dialog control
  const handleOpenModal = () => setIsEditDialogOpen(true)
  const handleCloseModal = () => setIsEditDialogOpen(false)

  const { product, isLoading, error, emptyState, refetch } =
    useProductView(productId)

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load product"
        onRetry={() => refetch()}
      />
    )
  }

  if (isLoading) {
    return <ProductDetailCardSkeleton />
  }

  if (emptyState === "removed") {
    return (
      <EmptyState
        title="Product was removed"
        note="This product has been deleted. It may have been removed from the catalog."
      />
    )
  }

  if (emptyState === "notFound") {
    return <EmptyState title="Product not found" />
  }

  // If product is null, don't render anything (shouldn't happen after checks above)
  if (!product) {
    return null
  }

  return (
    <>
      {/* Edit button */}
      <div className="mb-4 flex justify-end">
        <Button onClick={handleOpenModal} variant="secondary">
          Edit Product
        </Button>
      </div>

      {/* Product detail card */}
      <ProductDetailCard product={product} />

      {/* Edit product dialog */}
      <ProductFormDialogWidget
        mode="edit"
        product={product}
        open={isEditDialogOpen}
        onCloseDialog={handleCloseModal}
      />
    </>
  )
}
