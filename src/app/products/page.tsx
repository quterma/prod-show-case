"use client"

import { useRouter } from "next/navigation"

import { useGetProductsQuery } from "@/entities/product"
import { ErrorMessage, EmptyState } from "@/shared/ui"
import { ProductsWidget } from "@/widgets/products/ui"

export default function ProductsPage() {
  const router = useRouter()
  const { data, isLoading, error, refetch } = useGetProductsQuery()

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products"
        onRetry={() => refetch()}
      />
    )
  }

  if (!isLoading && (!data || data.length === 0)) {
    return <EmptyState title="No products found" />
  }

  return (
    <div>
      <h1>Products List</h1>
      <ProductsWidget
        products={data ?? []}
        isLoading={isLoading}
        onItemClick={(id) => router.push(`/products/${id}`)}
      />
    </div>
  )
}
