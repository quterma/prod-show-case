"use client"

import { useParams } from "next/navigation"

import { useGetProductByIdQuery } from "@/entities/product"
import { Skeleton, ErrorMessage, EmptyState, ProductCard } from "@/shared/ui"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useGetProductByIdQuery(
    Number(params.id)
  )

  if (isLoading) {
    return <Skeleton lines={3} />
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
      <ProductCard product={data} />
    </div>
  )
}
