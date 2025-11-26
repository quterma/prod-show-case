"use client"

import dynamic from "next/dynamic"

// Disable SSR for ProductsWidget to prevent hydration mismatch
// The widget depends on localStorage state which differs between server and client
const ProductsWidget = dynamic(
  () => import("@/widgets/products").then((mod) => mod.ProductsWidget),
  { ssr: false }
)

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProductsWidget />
    </div>
  )
}
