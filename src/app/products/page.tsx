"use client"

import { useRouter } from "next/navigation"

import { ProductsWidget } from "@/widgets/products/ui"

export default function ProductsPage() {
  const router = useRouter()

  return (
    <div>
      <h1>Products List</h1>
      <ProductsWidget onItemClick={(id) => router.push(`/products/${id}`)} />
    </div>
  )
}
