"use client"

import { useParams } from "next/navigation"

import { useGetProductByIdQuery } from "@/entities/product"
import {
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "@/entities/product/ui"
import { ErrorMessage, EmptyState } from "@/shared/ui"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useGetProductByIdQuery(
    Number(params.id)
  )

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

  return (
    <div>
      <h1>Product Detail</h1>
      <ProductDetailCard product={data} />
    </div>
  )
}
