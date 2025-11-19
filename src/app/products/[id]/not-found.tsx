import Link from "next/link"

import { EmptyState } from "@/shared/ui"

/**
 * Product detail 404 page - shown when product ID is invalid
 * Triggered by notFound() in app/products/[id]/page.tsx
 */
export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <EmptyState
        title="Product Not Found"
        note="The product you're looking for doesn't exist or the ID is invalid."
      />
      <Link
        href="/products"
        className="text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Products
      </Link>
    </div>
  )
}
