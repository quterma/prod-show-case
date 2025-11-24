"use client"

import dynamic from "next/dynamic"
import { useParams } from "next/navigation"

// Disable SSR for ProductDetailWidget to prevent hydration mismatch
// The widget depends on localStorage state which differs between server and client
const ProductDetailWidget = dynamic(
  () =>
    import("@/widgets/product-detail").then((mod) => mod.ProductDetailWidget),
  { ssr: false }
)

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Product Detail</h1>
      </div>
      <ProductDetailWidget productId={params.id} />
    </div>
  )
}
