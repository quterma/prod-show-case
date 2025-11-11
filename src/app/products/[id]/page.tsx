"use client"

import { useParams } from "next/navigation"

import { ProductDetailWidget } from "@/widgets/product-detail/ui"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()

  return (
    <div>
      <h1>Product Detail</h1>
      <ProductDetailWidget productId={Number(params.id)} />
    </div>
  )
}
