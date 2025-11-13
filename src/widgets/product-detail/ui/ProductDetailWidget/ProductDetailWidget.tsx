"use client"

import {
  useGetProductByIdQuery,
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "@/entities/product"
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
