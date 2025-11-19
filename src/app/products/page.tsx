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
    <div>
      <h1>Products List</h1>
      <ProductsWidget />
    </div>
  )
}
