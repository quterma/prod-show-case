"use client"

import {
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "@/entities/product"
import { ErrorMessage, EmptyState } from "@/shared/ui"

import { useProductView } from "../../hooks"

type ProductDetailWidgetProps = {
  productId: number
}

export function ProductDetailWidget({ productId }: ProductDetailWidgetProps) {
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

  return <ProductDetailCard product={product!} />
}
