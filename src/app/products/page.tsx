"use client"

import { useGetProductsQuery } from "@/entities/product"

export default function ProductsPage() {
  const { data, isLoading, error } = useGetProductsQuery()

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  if (!data || data.length === 0) {
    return <div>No products found</div>
  }

  return (
    <div>
      <h1>Products List</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
