"use client"

import { useRouter } from "next/navigation"

import { useGetProductsQuery } from "@/entities/product"
import { Skeleton, ErrorMessage, EmptyState } from "@/shared/ui"
import { ProductsGrid } from "@/widgets/products/ui"

export default function ProductsPage() {
  const router = useRouter()
  const { data, isLoading, error, refetch } = useGetProductsQuery()

  if (isLoading) {
    return <Skeleton lines={5} />
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No products found" />
  }

  return (
    <div>
      <h1>Products List</h1>
      <ProductsGrid
        products={data}
        onItemClick={(id) => router.push(`/products/${id}`)}
      />
    </div>
  )
}
