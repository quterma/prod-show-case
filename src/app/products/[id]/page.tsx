"use client"

import { useParams } from "next/navigation"

import { useGetProductByIdQuery } from "@/entities/product"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, error } = useGetProductByIdQuery(Number(params.id))

  if (isLoading) {
    return <div>Loading product...</div>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  if (!data) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <h1>Product Detail</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
