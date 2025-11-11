"use client"

import { useGetProductByIdQuery } from "@/entities/product"
import {
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "@/entities/product/ui"
import { ErrorMessage, EmptyState } from "@/shared/ui"

type ProductDetailWidgetProps = {
  productId: number
}

export function ProductDetailWidget({ productId }: ProductDetailWidgetProps) {
  const { data, isLoading, error, refetch } = useGetProductByIdQuery(productId)

  if (isLoading) {
    return <ProductDetailCardSkeleton />
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load product"
        onRetry={() => refetch()}
      />
    )
  }

  if (!data) {
    return <EmptyState title="Product not found" />
  }

  return <ProductDetailCard product={data} />
}
