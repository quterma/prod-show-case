"use client"

import { notFound, useParams } from "next/navigation"

import { parseProductId } from "@/shared/lib/validations"
import { ProductDetailWidget } from "@/widgets/product-detail"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()

  // Validate and parse product ID
  const productId = parseProductId(params.id)

  // If invalid ID, trigger 404
  if (productId === null) {
    notFound()
  }

  return (
    <div>
      <h1>Product Detail</h1>
      <ProductDetailWidget productId={productId} />
    </div>
  )
}
